import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsString, MinLength} from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        example: 'Паша',
        description: 'Имя'
    })
    @IsDefined()
    @IsString()
    readonly name: string;

    @ApiProperty({
        example: 'user@email.ru',
        description: 'Почта'
    })
    @IsDefined()
    @IsString() // если сделать @IsEmail - будет проверяться по маске емаила
    readonly email: string;

    @ApiProperty({
        example: '112233',
        description: 'Пароль'
    })
    @IsDefined()
    @IsString()
    @MinLength(3)
    readonly password: string;

    @ApiProperty({
        example: 'iOS',
        description: 'Идентификатор девайса'
    })
    @IsDefined()
    @IsString()
    readonly deviceFingerprint: string;
}