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

        const placeInfoInstance: PlaceInfoDto = {
            title: place.title,
            description: place.description,
            imagePath: place.imagePath,
            address: place.address,
            city: place.city,
            latitude: place.latitude,
            longitude: place.longitude,
        }

        return placeInfoInstance;
    }

    async getPlaceById(id: number) {
        const place = await this.placeRepository.findOne({where: {id}});
        return place;
    }
}
