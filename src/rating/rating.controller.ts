import {Controller, Post, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {API_V1, RATING_TAG} from "../constrants";
import {BodyWithValidation} from "../decorators";
import {RatingService} from "./rating.service";
import {AddExcursionRatingDto} from "./dto/add-excursion-rating.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Request} from "express";

@ApiTags(RATING_TAG)
@Controller(`${API_V1}/${RATING_TAG}`)
export class RatingController {
    constructor(private ratingService: RatingService) {}
    @Post()
    @ApiOperation({
        summary: "Проставление рейтинга"
    })
    @ApiResponse({
        status: 200,
    })
    @UseGuards(JwtAuthGuard)
    create(@Req() req: Request, @BodyWithValidation() dto: AddExcursionRatingDto) {
        const user = req.body.user;
        return this.ratingService.addExcursionRating(user.id, dto);
    }

}
