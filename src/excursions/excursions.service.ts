import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Excursion} from "./excursions.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateExcursionDto} from "./dto/create-excursion.dto";
import {AddPlaceDto} from "../places/dto/add-place.dto";
import {UsersService} from "../users/users.service";
import {ExcursionPlaces} from "../places/excursion-place.model";

@Injectable()
export class ExcursionsService {

    constructor(@InjectModel(Excursion) private excursionRepository: typeof Excursion,
                @InjectModel(ExcursionPlaces) private excursionPlaces: typeof ExcursionPlaces,
                private userService: UsersService) {
    }

    async createExcursion(dto: CreateExcursionDto) {
        const user = await this.userService.getUserById(dto.ownerId); // SELECT овнера для получения роли под которой была создана создаваемая экскурсия
        const ownerRoleValue = user.role.value;
        const excursion = await this.excursionRepository.create({...dto, ownerRoleValue: ownerRoleValue}); // INSERT в таблицу экскурсий

        const excursionId = excursion.id;
        let orderNumber = 0; // Порядковый номер в маршруте
        for (let pId of dto.placesIds) { // Последовательная привязка всех мест с переданными айдишниками к этой экскурсии
            if (excursion && pId) {
                await excursion.$add('place', pId); // INSERT в таблицу привязки места к экскурсии
                await this.updatePlaceSortValue(pId, excursionId, orderNumber) // Установка/обновление порядкового номера точки в экскурсии
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
}
