import {Controller, Get, Post} from '@nestjs/common';
import {CreatePlaceDto} from "./dto/create-place.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Place} from "./places.model";
import {PlacesService} from "./places.service";
import {BodyWithValidation, IdParam} from "../decorators";

@ApiTags('Точки (места/достопримечательности)')
@Controller('places')
export class PlacesController {
    constructor(private placeService: PlacesService) {}

    @Post()
    @ApiOperation({summary: "Создание точки"})
    @ApiResponse({status: 200, type: Place})
    create(@BodyWithValidation() dto: CreatePlaceDto) {
        return this.placeService.createPlace(dto);
    }

    @ApiOperation({summary: "Получение точки по id"})
    @ApiResponse({status: 200, type: Place})
    @Get('/:id')
    getById(@IdParam('id') id: number) {
        return this.placeService.getPlaceById(id);
    }

    @ApiOperation({summary: "Получение всех мест"})
    @ApiResponse({status: 200, type: [Place]})
    @Get()
    getAllPlaces() {
        return this.placeService.getAllPlaces();
    }
}
