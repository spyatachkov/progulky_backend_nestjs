import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNumber, IsOptional, IsString} from "class-validator";

export class AddExcursionRatingDto {
    @ApiProperty({
        description: 'Id экскурсии'
    })
    @IsDefined()
    @IsNumber()
    readonly excursionId: number;

    @ApiProperty({
        description: 'Оценка (от 1 до 5)'
    })
    @IsDefined()
    @IsNumber()
    readonly rating: number;

    @ApiProperty({
        description: 'Отзыв'
    })
    @IsOptional()
    @IsString()
    readonly comment: string;
}