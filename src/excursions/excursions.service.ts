import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
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

@Injectable()
export class ExcursionsService {

    constructor(@InjectModel(Excursion) private excursionRepository: typeof Excursion,
                @InjectModel(ExcursionPlaces) private excursionPlaces: typeof ExcursionPlaces,
                @InjectModel(UsersFavoritesExcursions) private usersFavoritesExcursions: typeof UsersFavoritesExcursions,
                private userService: UsersService,
                private fileService: FilesService) {
    }

    // в этой функции приведение к Number() идет из-за того, что на уровне декоратора
    // проверилось, что в запросе была строка в которой было число, а так как в multipart form data
    // всегда строки, непонятно как вообще может эта строка кастоваться в число, поэтому сделан принудительный каст и проверка
    async createExcursion(dto: CreateExcursionDto, image: any) {
        const filaName =  await this.fileService.createFile(image);

        const placesIds = dto.placesIds.split(","); // Полученную строку с айдишниками превращаю в массив строк
        // TODO: сделать проверку на то, что в полученном массиве значения, которые кастуются в число
        const numberOfPoints = placesIds.length; // Количество точек на маршруте

        const ownerId = Number(dto.ownerId);

        const user = await this.userService.getUserById(ownerId); // SELECT овнера для получения роли под которой была создана создаваемая экскурсия
        const ownerRoleValue = user.role.value;

        const excursion = await this.excursionRepository.create({
            ...dto,
            image: filaName,
            ownerRoleValue: ownerRoleValue,
            numberOfPoints: numberOfPoints,
            ownerId: Number(dto.ownerId),
            duration: Number(dto.duration),
            distance: Number(dto.distance),
        }); // INSERT в таблицу экскурсий

        const excursionId = excursion.id;
        let orderNumber = 0; // Порядковый номер в маршруте

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

    async getAllExcursions() {
        const excursions = await this.excursionRepository.findAll({include: {all: true},});
        //return excursions;
        return excursions.map((e) => Excursion.toObj(e));
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
    async addExcursionToFavorites(dto: AddExcursionToFavoritesDto) {
        const fe = await this.issetFavoritesExcursions(dto.userId, dto.excursionId);

        // проверка на дубликат
        if (fe.length != 0) {
            throw new HttpException('Экскурсия с id = ' + dto.excursionId + ' уже есть в избранном у пользователя с id = ' + dto.userId, HttpStatus.OK);
        }

        const excursion = await this.usersFavoritesExcursions.create({
            ...dto
        });
        return excursion;
    }

    // проверка - есть ли уже экскурсия с переданным id у пользователя с переданным id
    private async issetFavoritesExcursions(userId: number, excursionId: number) {
        const fe = await this.usersFavoritesExcursions.findAll({where: {userId: userId, excursionId: excursionId}})
        return fe;
    }

    // Удаление экскурсии из избранного пользователя
    async deleteExcursionFromFavorites(dto: DeleteExcursionFromFavoritesDto) {
        const excursion = await this.usersFavoritesExcursions.destroy({where: {userId: dto.userId, excursionId: dto.excursionId}})
        const message = excursion == 1 ? {"message": "successful deletion"}: {"message": "nothing to delete"};
        return message
    }
}
