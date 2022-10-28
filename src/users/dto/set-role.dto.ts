import {ApiProperty} from "@nestjs/swagger";

export class SetRoleDto {
    @ApiProperty({example: 'Паша', description: 'Имя'})
    readonly name: string;

    @ApiProperty({example: '2', description: 'Id роли которую хотим установить'})
    readonly roleId: number;
}
