import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNumber} from "class-validator";

export class DeleteExcursionFromFavoritesDto {
    @ApiProperty({example: '1', description: 'id экскурсии которую надо удалить из избранного'})
    @IsDefined()
    @IsNumber()
    readonly excursionId: number;
}