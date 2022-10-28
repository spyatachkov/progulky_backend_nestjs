import {ApiProperty} from "@nestjs/swagger";

export class UserRoleInstanceDto {
    @ApiProperty({example: '2', description: 'Id роли'})
    id: number;

    @ApiProperty({example: 'guide', description: 'Название роли'})
    value: string;

    @ApiProperty({example: 'Экскурсовод', description: 'Описание роли'})
    description: string;
}