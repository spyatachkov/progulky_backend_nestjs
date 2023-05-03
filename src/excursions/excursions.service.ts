import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {Excursion} from "./excursions.model";
import {InjectModel} from "@nestjs/sequelize";
import {AddPlaceDto} from "../places/dto/add-place.dto";
import {UsersService} from "../users/users.service";
import {ExcursionPlaces} from "../places/excursion-place.model";
import {CreateExcursionDto} from "./dto/create-excursion.dto";
import {UsersFavoritesExcursions} from "../users/users-favorites-excursions.model";
import {AddExcursionToFavoritesDto} from "./dto/add-excursion-to-favorites.dto";
import {DeleteExcursionFromFavoritesDto} from "./dto/delete-excursion-from-favorites.dto";
import {AuthService} from "../auth/auth.service";
import {UserInfoInstanceDto} from "../users/dto/user-info.dto";
import {Place} from "../places/places.model";
import {ShortExcursionInstanceDto} from "./dto/short-excursion-instance.dto";
import {Op} from "sequelize";
import {ExcursionFiltersDto} from "./dto/excursion-filters.dto";

@Injectable()
export class ExcursionsService {

    constructor(@InjectModel(Excursion) private excursionRepository: typeof Excursion,
                @InjectModel(Place) private placeRepository: typeof Place,
                @InjectModel(ExcursionPlaces) private excursionPlacesRepository: typeof ExcursionPlaces,
                @InjectModel(UsersFavoritesExcursions) private favoritesExcursionsRepository: typeof UsersFavoritesExcursions,
                private userService: UsersService,
                private authService: AuthService) {
    }

    // в этой функции приведение к Number() идет из-за того, что на уровне декоратора
    // проверилось, что в запросе была строка в которой было число, а так как в multipart form data
    // всегда строки, непонятно как вообще может эта строка кастоваться в число, поэтому сделан принудительный каст и проверка
    async createExcursion(dto: CreateExcursionDto, authHeader: string) {
        const token = await this.verifyHeader(authHeader);
        let user = await this.authService.verifyToken(token);
        const userId = user.id;

        const placesIds = dto.placesIds.split(","); // Полученную строку с айдишниками превращаю в массив строк
        // TODO: сделать проверку на то, что в полученном массиве значения, которые кастуются в число
        const numberOfPoints = placesIds.length; // Количество точек на маршруте

        // TODO: вообще объект юзера находится в токене. Надо подумать как обновлять его, если например
        // TODO: ему выдали новую роль, она в сохраненным локальном юзере не изменится, поэтому тут перезапрос юзера по его id
        user = await this.userService.getUserById(userId); // SELECT овнера для получения роли под которой была создана создаваемая экскурсия
        const ownerRoleValue = user.role.value;

        const excursion = await this.excursionRepository.create({
            ...dto,
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

    // Список всех экскурсий (доступен без авторизации)
    async getAllExcursions(filters: ExcursionFiltersDto) {
        let excursions: Excursion[];

        if (filters !== null) { // Если в запросе есть квери параметры
            excursions = await this.getExcursionsWithFilters(filters);
        } else {
            excursions = await this.excursionRepository
                .findAll({
                    include: {
                        all: true,
                        nested: true,
                    },
                });
        }

        return excursions
            .map((e) => Excursion.getShortExcursion(e));
    }

    private async getExcursionsWithFilters(filters: ExcursionFiltersDto) {
        let r_s: number;
        let r_f: number;

        if (filters.rating !== null) {
            const r = this.convertStringToNumbersRating(filters.rating)
            r_s = r.start
            r_f = r.end
        }

        const excursions = await this.excursionRepository
            .findAll({
                include: {
                    all: true,
                    nested: true,
                },
                where: {
                    ...(filters.l_f_p && filters.l_s_p ? {
                            distance: {
                                [Op.between]: [filters.l_f_p, filters.l_s_p],
                            },
                        } : {}
                    ),
                    ...(filters.t_f_p && filters.t_s_p ? {
                            duration: {
                                [Op.between]: [filters.t_f_p, filters.t_s_p],
                            },
                        }: {}
                    ),
                    ...(r_s && r_f ? { // Рейтинг
                            rating: {
                                [Op.between]: [r_s, r_f]
                            }
                        } : {}
                    ),
                    ...(filters.q ? {
                        title: {
                            [Op.substring]: filters.q,
                        },
                    } : {}
                    ),
                }
            });
        return excursions;
    }

    // Перевод строки в конкретные значения рейтинга | all - 0-5.0 | high - 5.0-4.5 | middle - 4.5-4.0 | low - 4.0-3.5
    private convertStringToNumbersRating(ratingString: string) {
        let r_s: number;
        let r_f: number;

        switch (ratingString) {
            case 'all':
                r_s = 0;
                r_f = 5.0;
                break;
            case 'high':
                r_s = 4.5;
                r_f = 5.0;
                break;
            case 'middle':
                r_s = 4.0;
                r_f = 4.5;
                break;
            case 'low':
                r_s = 3.5;
                r_f = 4.0;
                break;
        }
        return {
            'start': r_s,
            'end': r_f
        }
    }

    // Получить экскурсию по айди может только АВТОРИЗОВАННЫЙ пользователь
    async getExcursionById(authHeader: string, id: number) {
        const token = await this.verifyHeader(authHeader);
        const u = await this.authService.verifyToken(token);
        const user = await this.userService.getUserById(u.id);

        // Экскурсия по id
        const e = await this.excursionRepository
            .findByPk(
                id,
                {
                    include: {
                        all: true,
                        nested: true
                    }
                });

        // id мест этой экскурсии
        const placesIdsModels = await this.excursionPlacesRepository
            .findAll({
                where: {
                    excursionId: e.id,
                }
            });

        // id мест этой экскурсии и их порядковый номер (sort)
        const placesIdsAndSort = placesIdsModels
            .map((e) => {
                return {
                    placeId: e.placeId,
                    sort: e.sort
                };
        });

        const placesIds = placesIdsAndSort.map((e) => e.placeId);

        // SELECT мест экскурсии с этим id
        const p = await this.placeRepository.findAll({
            where: {
                id: placesIds,
            }
        });

        const places = p.map((e, i) => {
            const r = Place.getShortPlaceInfo(e);
            r.sort = placesIdsAndSort[i].sort;
            return r;
        });

        const excursionResponse = Excursion.getExtendedExcursion(e);
        excursionResponse.places = places;

        // Вычисление принадлежности этой экскурсии к избранным юзера
        const ids = await this.getFavoritesExcursionsIds(user) // айди избранных экскурсий пользователя
        excursionResponse.isFavorite = ids.includes(e.id);
        return excursionResponse;
    }

    // id-шники избранных экскурсий пользователя
    private async getFavoritesExcursionsIds(user: UserInfoInstanceDto) {
        const favoritesExcursionsModelByUserId = await this.favoritesExcursionsRepository
            .findAll({
                where: {
                    userId: user.id
                },
            });
        return favoritesExcursionsModelByUserId.map((e) => e.excursionId);
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
        await this.excursionPlacesRepository.update(
            {sort: sortValue},
            {where: {excursionId: excursionId, placeId: placeId}}
        );
    }

    private async selectAllPlacesExcursionById(excursionId: number) {
        return await this.excursionPlacesRepository.findAll({where: {excursionId: excursionId}});
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

    // Получение избранных экскурсий пользователя
    async getFavoritesExcursions(authHeader: string) {
        const token = await this.verifyHeader(authHeader);
        const u = await this.authService.verifyToken(token);
        const user = await this.userService.getUserById(u.id);
        const favoritesExcursionsModelByUserId = await this.favoritesExcursionsRepository
            .findAll({
                where: {
                    userId: user.id
                },
                include: {
                    all: true
                }
            });

        const favoritesExcursionsIds = favoritesExcursionsModelByUserId
            .map((f) => f.excursionId); // id избранных экскурсий пользователя

        let favoritesExcursions: ShortExcursionInstanceDto[] = [];

        const fe = await this.excursionRepository
            .findAll({
                include: {
                    all: true,
                    nested: true,
                },
                where: {
                    id: favoritesExcursionsIds,
                }
            });

        favoritesExcursions = fe.map((e) => Excursion.getShortExcursion(e));
        return favoritesExcursions;
    }

    // Запуск пересчета рейтинга экскурсий
    async updateExcursionsRating() {
        let excursions: Excursion[];

        // Получение всех экскурсий из базы
        excursions = await this.excursionRepository
            .findAll({
                include: {
                    all: true,
                    nested: true,
                },
            });

        for (let excursion of excursions) {
            let sum_rating = 0;
            sum_rating = excursion.ratings.reduce((sum, current) => sum + current.rating, 0)
            let arithmetic_mean = sum_rating / (excursion.ratings.length === 0 ? 1 : excursion.ratings.length)

            await this.excursionRepository.update({ rating: arithmetic_mean }, {
                where: {
                    id: excursion.id
                }
            });
        }
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
