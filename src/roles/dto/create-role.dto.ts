import {ApiProperty} from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({example: 'guide', description: 'Название добавляемой роли'})
    readonly value: string;

    @ApiProperty({example: 'Экскурсовод', description: 'Описание добовляемой роли'})
    readonly description: string;
}