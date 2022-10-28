import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {CreateExcursionDto} from "./dto/create-excursion.dto";
import {ExcursionsService} from "./excursions.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Excursion} from "./excursions.model";
import {AddPlaceDto} from "../places/dto/add-place.dto";
import {ExcursionInstanceDto} from "./dto/excursion-instance.dto";

@ApiTags('Экскурсии')
@Controller('excursions')
export class ExcursionsController {

    constructor(private excursionService: ExcursionsService) {}

    @ApiOperation({summary: "Создание экскурсии"})
    @ApiResponse({status: 200, type: ExcursionInstanceDto})
    @Post()
    createExcursion(@Body() excursionDto: CreateExcursionDto) {
        return this.excursionService.createExcursion(excursionDto);
    }

    @ApiOperation({summary: "Получение всех экскурсии"})
    @ApiResponse({status: 200, type: [Excursion]})
    @Get()
    getAllExcursions() {
        return this.excursionService.getAllExcursions();
    }

    @ApiOperation({summary: "Добавить точку к экскурсии"})
    @ApiResponse({status: 200, type: [Excursion]})
    @Post('/add_place')
    addPlace(@Body() dto: AddPlaceDto) {
        return this.excursionService.addPlace(dto);
    }

    // @ApiOperation({summary: "Удалить точку у экскурсии"})
    // @ApiResponse({status: 200})
    // @Delete('/delete_place/:id')
    // deletePlace(@Param('id') id: number) {
    //     return this.excursionService.deletePlace(id);
    // }
}
