import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNumber} from "class-validator";

export class AddExcursionToFavoritesDto {
    @ApiProperty({example: '1', description: 'id экскурсии которую надо добавить в избранное'})
    @IsDefined()
    @IsNumber()
    readonly excursionId: number;

    @ApiProperty({example: '1', description: 'id пользователя, который добавляет экскурсию в избранное'})
    @IsDefined()
    @IsNumber()
    readonly userId: number;
}