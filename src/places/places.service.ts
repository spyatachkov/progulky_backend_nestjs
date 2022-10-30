import { Injectable } from '@nestjs/common';
import {CreatePlaceDto} from "./dto/create-place.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Place} from "./places.model";
import {PlaceInfoDto} from "./dto/place-info.dto";

@Injectable()
export class PlacesService {

    constructor(@InjectModel(Place) private placeRepository: typeof Place) {}

    async createPlace(dto: CreatePlaceDto) {
        const place = await this.placeRepository.create(dto);
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
}
