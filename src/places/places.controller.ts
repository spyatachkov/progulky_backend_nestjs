import {Controller, Get, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {CreatePlaceDto} from "./dto/create-place.dto";
import {ApiConsumes, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Place} from "./places.model";
import {PlacesService} from "./places.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {BodyWithValidation, IdParam} from "../decorators";

@ApiTags('Точки (места/достопримечательности)')
@Controller('places')
export class PlacesController {
    constructor(private placeService: PlacesService) {}

    @Post()
    @ApiOperation({summary: "Создание точки"})
    @ApiResponse({status: 200, type: Place})
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    create(@BodyWithValidation() dto: CreatePlaceDto,
           @UploadedFile() image) {
        return this.placeService.createPlace(dto, image);
    }

    @ApiOperation({summary: "Получение точки по id"})
    @ApiResponse({status: 200, type: Place})
    @Get('/:id')
    getById(@IdParam('id') id: number) {
        return this.placeService.getPlaceById(id);
    }
}
