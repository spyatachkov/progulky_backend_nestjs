import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

// DTO для запроса новой пары токенов (для обновления ацесса и рефреша)
export class RequestNewTokenPairDto {
    @ApiProperty({
        example: 'iOS',
        description: 'Идентификатор устройства'
    })
    @IsDefined()
    @IsString()
    readonly deviceFingerprint: string;

    @ApiProperty({
        example: 'refresh',
        description: 'Рефреш-токен'
    })
    @IsDefined()
    @IsString()
    readonly refreshToken: string;
}