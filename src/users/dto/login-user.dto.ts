import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

export class LoginUserDto {
    @ApiProperty({
        example: 'semyon@mail.ru',
        description: 'Почта'
    })
    @IsDefined()
    @IsString()
    readonly email: string;

    @ApiProperty({
        example: '112233',
        description: 'Пароль'
    })
    @IsDefined()
    @IsString()
    readonly password: string;

    @ApiProperty({
        example: 'iOS',
        description: 'Идентификтор устройства'
    })
    @IsDefined()
    @IsString()
    readonly deviceFingerprint: string;
}