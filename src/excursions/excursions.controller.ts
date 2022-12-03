import {Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {CreateExcursionDto} from "./dto/create-excursion.dto";
import {ExcursionsService} from "./excursions.service";
import {ApiConsumes, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Excursion} from "./excursions.model";
import {CreateExcursionResponseDto} from "./dto/create-excursion-response.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiImplicitFile} from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import {BodyWithValidation} from "../decorators";
import {AddExcursionToFavoritesDto} from "./dto/add-excursion-to-favorites.dto";

@ApiTags('Экскурсии')
@Controller('excursions')
export class ExcursionsController {

    constructor(private excursionService: ExcursionsService) {}

    @Post()
    @ApiOperation({summary: "Создание экскурсии"})
    @ApiResponse({status: 200, type: CreateExcursionResponseDto})
    @ApiConsumes('multipart/form-data')
    // @ApiImplicitFile({ name: 'image', required: true })
    @UseInterceptors(FileInterceptor('image'))
    createExcursion(@BodyWithValidation() excursionDto: CreateExcursionDto,
                    @UploadedFile() image) {
        return this.excursionService.createExcursion(excursionDto, image);
    }

    @ApiOperation({summary: "Получение всех экскурсии"})
    @ApiResponse({status: 200, type: [Excursion]})
    @Get()
    getAllExcursions() {
        return this.excursionService.getAllExcursions();
    }

    @Post('add_favorite')
    @ApiOperation({summary: "Добавить экскурсию в избранное пользователя"})
    @ApiResponse({status: 200, type: AddExcursionToFavoritesDto}) // TODO: какую модель возвращать???
    addExcursionToFavorites(@BodyWithValidation() dto: AddExcursionToFavoritesDto) {
        return this.excursionService.addExcursionToFavorites(dto)
    }

    @Delete('delete_favorite')
    @ApiOperation({summary: "Удалить экскурсию из избранного пользователя"})
    @ApiResponse({status: 200}) // TODO: какую модель возвращать???
    deleteExcursionFromFavorites(@BodyWithValidation() dto: AddExcursionToFavoritesDto) {
        return this.excursionService.deleteExcursionFromFavorites(dto)
    }

    // Deprecated: теперь точки привязываются вместе с созданием экскурсии
    // @ApiOperation({summary: "Добавить точку к экскурсии"})
    // @ApiResponse({status: 200, type: [Excursion]})
    // @Post('/add_place')
    // addPlace(@Body() dto: AddPlaceDto) {
    //     return this.excursionService.addPlace(dto);
    // }

    // TODO: Удалить точку у экскурсии
    // @ApiOperation({summary: "Удалить точку у экскурсии"})
    // @ApiResponse({status: 200})
    // @Delete('/delete_place/:id')
    // deletePlace(@Param('id') id: number) {
    //     return this.excursionService.deletePlace(id);
    // }
}
