import {ApiProperty} from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({example: 'semyon@mail.ru', description: 'Почта'})
    readonly email: string;

    @ApiProperty({example: '112233', description: 'Пароль'})
    readonly password: string;
}