import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNumber, IsNumberString, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreatePlaceDto {
    @ApiProperty({example: 'Большой театр', description: 'Заголовок точки'})
    @IsDefined()
    @IsString()
    readonly title: string;

    @ApiProperty({example: 'Самый большой театр в стране. Поэтому и называется большой', description: 'Описание места'})
    @IsDefined()
    @IsString()
    readonly description: string;

    @ApiProperty({type: 'file', description: 'Файл картинки'})
    readonly image: string;

    @ApiProperty({example: 'Театральная площадь, 1', description: 'Адрес точки'})
    @IsDefined()
    @IsString()
    readonly address: string;

    @ApiProperty({example: 'Москва', description: 'Город точки'})
    @IsDefined()
    @IsString()
    readonly city: string;

    @ApiProperty({example: '55.760452', description: 'Широта', type: 'number'})
    @IsDefined()
    @IsNumberString()
    readonly latitude: string;

    @IsDefined()
    @IsNumberString()
    @ApiProperty({example: '37.618373', description: 'Долгота', type: 'number'})
    readonly longitude: string;
}