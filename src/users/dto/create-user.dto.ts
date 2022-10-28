import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: 'Паша', description: 'Имя'})
    readonly name: string;

    @ApiProperty({example: 'user@email.ru', description: 'Почта'})
    readonly email: string;

    @ApiProperty({example: '112233', description: 'Пароль'})
    readonly password: string;

    // @ApiProperty({example: '3', description: 'Роль'})
    // readonly roleId = 3; // user
}