import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {Excursion} from "./excursions.model";
import {InjectModel} from "@nestjs/sequelize";
import {AddPlaceDto} from "../places/dto/add-place.dto";
import {UsersService} from "../users/users.service";
import {ExcursionPlaces} from "../places/excursion-place.model";
import {FilesService} from "../files/files.service";
import {CreateExcursionDto} from "./dto/create-excursion.dto";
import {UsersFavoritesExcursions} from "../users/users-favorites-excursions.model";
import {AddExcursionToFavoritesDto} from "./dto/add-excursion-to-favorites.dto";
import {DeleteExcursionFromFavoritesDto} from "./dto/delete-excursion-from-favorites.dto";
import {JwtService} from "@nestjs/jwt";
import {AuthService} from "../auth/auth.service";
import {ExtendedExcursionInstanceDto} from "./dto/extended-excursion-instance.dto";
import {Place} from "../places/places.model";

@Injectable()
export class ExcursionsService {

    constructor(@InjectModel(Excursion) private excursionRepository: typeof Excursion,
                @InjectModel(ExcursionPlaces) private excursionPlaces: typeof ExcursionPlaces,
                @InjectModel(UsersFavoritesExcursions) private favoritesExcursionsRepository: typeof UsersFavoritesExcursions,
                private userService: UsersService,
                private fileService: FilesService,
                private authService: AuthService) {
    }

    // в этой функции приведение к Number() идет из-за того, что на уровне декоратора
    // проверилось, что в запросе была строка в которой было число, а так как в multipart form data
    // всегда строки, непонятно как вообще может эта строка кастоваться в число, поэтому сделан принудительный каст и проверка
    async createExcursion(dto: CreateExcursionDto, image: any, authHeader: string) {
        const token = await this.verifyHeader(authHeader);
        let user = await this.authService.verifyToken(token);
        const userId = user.id;

        const filaName =  await this.fileService.createFile(image);

        const placesIds = dto.placesIds.split(","); // Полученную строку с айдишниками превращаю в массив строк
        // TODO: сделать проверку на то, что в полученном массиве значения, которые кастуются в число
        const numberOfPoints = placesIds.length; // Количество точек на маршруте

        // TODO: вообще объект юзера находится в токене. Надо подумать как обновлять его, если например
        // TODO: ему выдали новую роль, она в сохраненным локальном юзере не изменится, поэтому тут перезапрос юзера по его id
        user = await this.userService.getUserById(userId); // SELECT овнера для получения роли под которой была создана создаваемая экскурсия
        const ownerRoleValue = user.role.value;

        const excursion = await this.excursionRepository.create({
            ...dto,
            image: filaName,
            ownerRoleValue: ownerRoleValue,
            numberOfPoints: numberOfPoints,
            ownerId: userId,
            duration: Number(dto.duration),
            distance: Number(dto.distance),
        }); // INSERT в таблицу экскурсий

        const excursionId = excursion.id;
        let orderNumber = 1; // Порядковый номер в маршруте

        for (let pId of placesIds) { // Последовательная привязка всех мест с переданными айдишниками к этой экскурсии
            if (excursion && pId) {
                await excursion.$add('place', Number(pId)); // INSERT в таблицу привязки места к экскурсии
                await this.updatePlaceSortValue(Number(pId), excursionId, orderNumber) // Установка/обновление порядкового номера точки в экскурсии
                orderNumber++;
            } else {
                throw new HttpException('Экскурсия или точка не найдены', HttpStatus.NOT_FOUND);
            }
        }
        return  {
            id: excursion.id,
            title: excursion.title,
        };
    }

    async getAllExcursions(authHeader: string) {
        if (authHeader == undefined) {
            // Если нет никакого авторизационного заголовка, возвращаю список всех экскурсий
            const excursions = await this.excursionRepository.findAll({include: {all: true},});
            return excursions.map((e) => Excursion.toObj(e));
        }
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];

        if (bearer == 'Bearer' && token == undefined) {
            // Если токена нет, но есть 'Bearer' возвращаю список всех экскурсий
            const excursions = await this.excursionRepository.findAll({include: {all: true},});
            return excursions.map((e) => Excursion.toObj(e));
        }

        if (bearer !== 'Bearer' || !token) {
            // Если в хедере в авторизации пришла дичь
            throw new UnauthorizedException({message: 'Ошибка авторизации'})
        }

        try {
            const user = await this.authService.verifyToken(token);
            // собственная лента (отмечаются добавленные в избранное экскурсии)
            const excursionsIncludingFavorites = await this.getExcursionsIncludingFavorites(user.id) // Все экскурсии, включая избранные (для пользователя, которые образается с токеном)
            return excursionsIncludingFavorites
        } catch (_) {
            throw new UnauthorizedException({message: 'Ошибка авторизации'})
        }
    }

    private async getExcursionsIncludingFavorites(userId: number) {
        const allExcursions = await this.excursionRepository.findAll({include: {all: true}});

        const favoritesExcursionsModelByUserId = await this.favoritesExcursionsRepository.findAll({where: {userId: userId}, include: {all: true}});
        const favoritesExcursionsIds = favoritesExcursionsModelByUserId.map((f) => f.excursionId); // id избранных экскурсий пользователя

        let excursionsIncludingFavorites: ExtendedExcursionInstanceDto[] = [];

        for (let e of allExcursions) {
            let excursion = new ExtendedExcursionInstanceDto(
                e.id,
                e.title,
                e.description,
                false,
                e.ownerId,
                e.ownerRoleValue,
                e.image,
                e.rating,
                e.duration,
                e.distance,
                e.numberOfPoints,
                {
                    id: e.owner.id,
                    name: e.owner.name,
                    email: e.owner.email,
                },
                e.places.map((p, sort) => Place.toObj(p, sort)
            ));
            // let pe = Excursion.toObj(e);
            if (favoritesExcursionsIds.includes(e.id)) { // такой айди есть в избранном
                excursion.isFavorite = true
                excursionsIncludingFavorites.push(excursion)
            } else {
                excursionsIncludingFavorites.push(excursion)
            }
        }
        return excursionsIncludingFavorites;
    }

    async addPlace(dto: AddPlaceDto) {
        const excursionId = dto.excursionId;
        const excursion = await this.excursionRepository.findByPk(excursionId);
        const placeId = dto.placeId;

        const sort = dto.sort; // Порядковый номер точки в экскурсии

        if (excursion && placeId) {
            await excursion.$add('place', placeId);
            await this.updatePlaceSortValue(placeId, excursionId, sort) // Установка/обновление порядкового номера точки в экскурсии
            return dto;
        }
        throw new HttpException('Экскурсия или точка не найдены', HttpStatus.NOT_FOUND);
    }

    async deletePlace(id: number) {
    }

    // Обновление порядкого номера точки в экскурсии
    private async updatePlaceSortValue(placeId: number, excursionId: number, sortValue: number) {
        await this.excursionPlaces.update(
            {sort: sortValue},
            {where: {excursionId: excursionId, placeId: placeId}}
        );
    }

    private async selectAllPlacesExcursionById(excursionId: number) {
        return await this.excursionPlaces.findAll({where: {excursionId: excursionId}});
    }

    // Добавление экскурсии в избранное по айди этой экскурсии для пользователя с переданным id
    async addExcursionToFavorites(dto: AddExcursionToFavoritesDto, authHeader: string) {
            const token = await this.verifyHeader(authHeader);
            const user = await this.authService.verifyToken(token);
            const userId = user.id;
            const isIsset = await this.issetFavoritesExcursions(userId, dto.excursionId);

            if (isIsset) { // проверка на дубликат
                throw new HttpException('Экскурсия с id = ' + dto.excursionId + ' уже есть в избранном у пользователя с id = ' + userId, HttpStatus.OK);
            }
            const excursion = await this.favoritesExcursionsRepository.create({
                userId: userId,
                ...dto
            });
            return excursion;
    }

    // проверка - есть ли уже экскурсия с переданным id у пользователя с переданным id
    private async issetFavoritesExcursions(userId: number, excursionId: number) {
        const issetExcursionInFavorites = await this.favoritesExcursionsRepository.findOne({where: {userId: userId, excursionId: excursionId}})
        return issetExcursionInFavorites;
    }

    // Удаление экскурсии из избранного пользователя
    async deleteExcursionFromFavorites(dto: DeleteExcursionFromFavoritesDto, authHeader: string) {
        const token = await this.verifyHeader(authHeader);
        const user = await this.authService.verifyToken(token);
        const userId = user.id;

        const excursion = await this.favoritesExcursionsRepository.destroy({
            where: {
                userId: userId,
                excursionId: dto.excursionId
            }
        })
        const message = excursion == 1 ? {"message": "successful deletion"} : {"message": "nothing to delete"};
        return message
    }

    // Проверяет корректность авторизационного хедера и либо возвращает токен, либо кидает ошибку
    private async verifyHeader(authHeader: string) {
        if (authHeader == undefined) {
            throw new UnauthorizedException({message: 'Ошибка авторизации'})
        }
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];
        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({message: 'Ошибка авторизации'})
        }
        return token;
    }
}
