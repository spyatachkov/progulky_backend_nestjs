import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

export class CreateRoleDto {
    @ApiProperty({example: 'guide', description: 'Название добавляемой роли'})
    @IsDefined()
    @IsString()
    readonly value: string;

    @ApiProperty({example: 'Экскурсовод', description: 'Описание добовляемой роли'})
    @IsDefined()
    @IsString()
    readonly description: string;
}