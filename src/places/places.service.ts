import { Injectable } from '@nestjs/common';
import {CreatePlaceDto} from "./dto/create-place.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Place} from "./places.model";
import {ExtendedPlaceInfoDto} from "./dto/extended-place-info.dto";

@Injectable()
export class PlacesService {

    constructor(
        @InjectModel(Place) private placeRepository: typeof Place)
    {}

    async createPlace(dto: CreatePlaceDto) {

        const place = await this.placeRepository.create({
            ...dto,
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
        const places: ExtendedPlaceInfoDto[] = []

        for (let place of allPlaces) {
            let p: ExtendedPlaceInfoDto = Place.getExtendedPlaceInfo(place);
            places.push(p)
        }
        return places;
    }
}
