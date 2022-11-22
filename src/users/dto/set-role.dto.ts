import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNumber, IsString} from "class-validator";

export class SetRoleDto {
    @ApiProperty({example: 'semyon@email.ru', description: 'Email'})
    @IsDefined()
    @IsString()
    readonly email: string;

    @ApiProperty({example: '2', description: 'Id роли которую хотим установить'})
    @IsDefined()
    @IsNumber()
    readonly roleId: number;
}
