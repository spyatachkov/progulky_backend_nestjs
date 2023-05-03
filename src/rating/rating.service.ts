import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Rating} from "./rating.model";
import {AddExcursionRatingDto} from "./dto/add-excursion-rating.dto";

@Injectable()
export class RatingService {
    constructor(
        @InjectModel(Rating) private ratingRepository: typeof Rating)
    {}

    async addExcursionRating(userId: number, dto: AddExcursionRatingDto) {
        try {
            await this.ratingRepository.create({
                excursionId: dto.excursionId,
                rating: dto.rating,
                userId: userId,
            });
            return {
                status: "successful.addition",
                message: "Экскурсия успешно оценена"
            }
        } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
                return {
                    status: "addition.rejected",
                    message: "Эта экскурсия уже была оценена. Повторная оценка невозможна"
                }
            }
        }
    }
}
