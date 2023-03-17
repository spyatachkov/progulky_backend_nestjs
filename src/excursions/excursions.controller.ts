import {Controller, Delete, Get, Post, Req} from '@nestjs/common';
import {CreateExcursionDto} from "./dto/create-excursion.dto";
import {ExcursionsService} from "./excursions.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Excursion} from "./excursions.model";
import {CreateExcursionResponseDto} from "./dto/create-excursion-response.dto";
import {BodyWithValidation, IdParam, QueryWithValidation} from "../decorators";
import {AddExcursionToFavoritesDto} from "./dto/add-excursion-to-favorites.dto";
import { Request } from 'express';
import {ExtendedExcursionInstanceDto} from "./dto/extended-excursion-instance.dto";
import {DeleteExcursionFromFavoritesDto} from "./dto/delete-excursion-from-favorites.dto";
import {API_V1, EXCURSIONS_TAG} from "../constrants";
import {ExcursionFiltersDto} from "./dto/excursion-filters.dto";

@ApiTags(EXCURSIONS_TAG)
@Controller(`${API_V1}/${EXCURSIONS_TAG}`)
export class ExcursionsController {

    constructor(private excursionService: ExcursionsService) {}

    @Post()
    @ApiOperation({
        summary: "Создание экскурсии"
    })
    @ApiResponse({
        status: 200,
        type: CreateExcursionResponseDto
    })
    createExcursion(@BodyWithValidation() excursionDto: CreateExcursionDto,
                    @Req() req: Request) {
        const authHeader = req.headers.authorization;
        return this.excursionService.createExcursion(excursionDto, authHeader);
    }

    @ApiOperation({
        summary: "Получение всех экскурсии"
    })
    @ApiResponse({
        status: 200,
        type: [ExtendedExcursionInstanceDto]
    })
    @Get()
    getAllExcursions(@QueryWithValidation() filters: ExcursionFiltersDto) {
        return this.excursionService.getAllExcursions(filters);
    }

    @ApiOperation({
        summary: "Получить избранные экскурсии"
    })
    @ApiResponse({
        status: 200,
        type: [Excursion]
    })
    @Get('favorites_excursions')
    getFavoritesExcursions(@Req() req: Request) {
        const authHeader = req.headers.authorization;
        return this.excursionService.getFavoritesExcursions(authHeader)
    }
    @Post('add_favorite')
    @ApiOperation({
        summary: "Добавить экскурсию в избранное пользователя"
    })
    @ApiResponse({
        status: 200,
        type: AddExcursionToFavoritesDto
    }) // TODO: какую модель возвращать???
    addExcursionToFavorites(@BodyWithValidation() dto: AddExcursionToFavoritesDto, @Req() req: Request) {
        const authHeader = req.headers.authorization;
        return this.excursionService.addExcursionToFavorites(dto, authHeader)
    }

    @Delete('delete_favorite')
    @ApiOperation({
        summary: "Удалить экскурсию из избранного пользователя"
    })
    @ApiResponse({
        status: 200
    }) // TODO: какую модель возвращать???
    deleteExcursionFromFavorites(@BodyWithValidation() dto: DeleteExcursionFromFavoritesDto, @Req() req: Request) {
        const authHeader = req.headers.authorization;
        return this.excursionService.deleteExcursionFromFavorites(dto, authHeader);
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

    @ApiOperation({
        summary: "Получение эксуксрии по id"
    })
    @ApiResponse({
        status: 200,
        type: ExtendedExcursionInstanceDto
    })
    @Get(':id')
    getExcursionById(@Req() req: Request, @IdParam() id: number) {
        const authHeader = req.headers.authorization;
        return this.excursionService.getExcursionById(authHeader, id);
    }
}
