import { Injectable } from '@nestjs/common';
import {CreatePlaceDto} from "./dto/create-place.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Place} from "./places.model";
import {PlaceInfoDto} from "./dto/place-info.dto";
import {FilesService} from "../files/files.service";
import {ExtendedExcursionInstanceDto} from "../excursions/dto/extended-excursion-instance.dto";

@Injectable()
export class PlacesService {

    constructor(@InjectModel(Place) private placeRepository: typeof Place,
                private fileService: FilesService) {}

    async createPlace(dto: CreatePlaceDto, image: any) {
        const filaName =  await this.fileService.createPlaceFile(image);

        const place = await this.placeRepository.create({
            ...dto,
            image: filaName,
            latitude: Number(dto.latitude),
            longitude: Number(dto.longitude)
        });
        return {
            id: place.id,
            title: place.title,
            latitude: place.latitude,
            longitude: place.longitude,
        };
    }

    async getPlaceById(id: number) {
        const place = await this.placeRepository.findOne({where: {id}});
        return place;
    }

    async getAllPlaces() {
        const allPlaces = await this.placeRepository.findAll();
        const places: PlaceInfoDto[] = []

        for (let place of allPlaces) {
            let p = new PlaceInfoDto(
                place.id,
                place.title,
                place.description,
                place.image,
                place.address,
                place.city,
                place.latitude,
                place.longitude,
            );
            places.push(p)
        }
        return places
    }
}
