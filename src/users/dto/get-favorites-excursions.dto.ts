import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNumber} from "class-validator";

export class GetFavoritesExcursionsDto {
    @ApiProperty({example: '1', description: 'id пользователя'})
    @IsDefined()
    @IsNumber()
    readonly userId: number;
}
