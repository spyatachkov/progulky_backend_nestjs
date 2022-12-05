import {Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseInterceptors} from '@nestjs/common';
import {CreateExcursionDto} from "./dto/create-excursion.dto";
import {ExcursionsService} from "./excursions.service";
import {ApiConsumes, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Excursion} from "./excursions.model";
import {CreateExcursionResponseDto} from "./dto/create-excursion-response.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {BodyWithValidation} from "../decorators";
import {AddExcursionToFavoritesDto} from "./dto/add-excursion-to-favorites.dto";
import { Request } from 'express';
import {ExtendedExcursionInstanceDto} from "./dto/extended-excursion-instance.dto";
import {DeleteExcursionFromFavoritesDto} from "./dto/delete-excursion-from-favorites.dto";

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
                    @UploadedFile() image,
                    @Req() req: Request) {
        const authHeader = req.headers.authorization;
        return this.excursionService.createExcursion(excursionDto, image, authHeader);
    }

    @ApiOperation({summary: "Получение всех экскурсии"})
    @ApiResponse({status: 200, type: [ExtendedExcursionInstanceDto]})
    @Get()
    getAllExcursions(@Req() req: Request) {
        const authHeader = req.headers.authorization;
        return this.excursionService.getAllExcursions(authHeader);
    }

    @Post('add_favorite')
    @ApiOperation({summary: "Добавить экскурсию в избранное пользователя"})
    @ApiResponse({status: 200, type: AddExcursionToFavoritesDto}) // TODO: какую модель возвращать???
    addExcursionToFavorites(@BodyWithValidation() dto: AddExcursionToFavoritesDto, @Req() req: Request) {
        const authHeader = req.headers.authorization;
        return this.excursionService.addExcursionToFavorites(dto, authHeader)
    }

    @Delete('delete_favorite')
    @ApiOperation({summary: "Удалить экскурсию из избранного пользователя"})
    @ApiResponse({status: 200}) // TODO: какую модель возвращать???
    deleteExcursionFromFavorites(@BodyWithValidation() dto: DeleteExcursionFromFavoritesDto, @Req() req: Request) {
        const authHeader = req.headers.authorization;
        return this.excursionService.deleteExcursionFromFavorites(dto, authHeader)
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
