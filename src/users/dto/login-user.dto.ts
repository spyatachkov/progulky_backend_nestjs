import {ApiProperty} from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({example: 'Паша', description: 'Имя'})
    readonly name: string;

    @ApiProperty({example: '112233', description: 'Пароль'})
    readonly password: string;
}