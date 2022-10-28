import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Excursion} from "./excursions.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateExcursionDto} from "./dto/create-excursion.dto";
import {AddPlaceDto} from "../places/dto/add-place.dto";
import {ExcursionInstanceDto} from "./dto/excursion-instance.dto";
import {UsersService} from "../users/users.service";
import {ExcursionPlaces} from "../places/excursion-place.model";

@Injectable()
export class ExcursionsService {

    constructor(@InjectModel(Excursion) private excursionRepository: typeof Excursion,
                @InjectModel(ExcursionPlaces) private excursionPlaces: typeof ExcursionPlaces,
                private userService: UsersService) {
    }

    async createExcursion(dto: CreateExcursionDto) {
        const excursion = await this.excursionRepository.create(dto);
        const user = await this.userService.getUserById(dto.ownerId)

        const excursionInstance: ExcursionInstanceDto = {
            title: excursion.title,
            description: excursion.description,
            imagePath: excursion.imagePath,
            rating: excursion.rating,
            duration: excursion.duration,
            ownerId: user.id,
            owner: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: {
                    id: user.role.id,
                    value: user.role.value,
                    description: user.role.description,
                }
            }
        };
        return excursionInstance;
    }

    async getAllExcursions() {
        const excursions = await this.excursionRepository.findAll({include: {all: true},});
        return excursions;
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
