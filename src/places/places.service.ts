import { Injectable } from '@nestjs/common';
import {CreatePlaceDto} from "./dto/create-place.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Place} from "./places.model";
import {PlaceInfoDto} from "./dto/place-info.dto";
import {FilesService} from "../files/files.service";

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
}
