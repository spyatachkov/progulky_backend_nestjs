import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {CreatePlaceDto} from "./dto/create-place.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Place} from "./places.model";
import {Role} from "../roles/roles.model";
import {PlacesService} from "./places.service";
import {AddPlaceDto} from "./dto/add-place.dto";

@ApiTags('Точки (места/достопримечательности)')
@Controller('places')
export class PlacesController {
    constructor(private placeService: PlacesService) {}

    @ApiOperation({summary: "Создание точки"})
    @ApiResponse({status: 200, type: Place})
    @Post()
    create(@Body() dto: CreatePlaceDto) {
        return this.placeService.createPlace(dto);
    }

    @ApiOperation({summary: "Получение точки по id"})
    @ApiResponse({status: 200, type: Place})
    @Get('/:id')
    getById(@Param('id') id: number) {
        return this.placeService.getPlaceById(id);
    }
}
