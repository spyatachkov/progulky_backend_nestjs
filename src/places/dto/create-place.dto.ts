import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNumber, IsNumberString, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreatePlaceDto {
    @ApiProperty({
        example: 'Большой театр',
        description: 'Заголовок точки'
    })
    @IsDefined()
    @IsString()
    readonly title: string;

    @ApiProperty({
        example: 'Самый большой театр в стране. Поэтому и называется большой',
        description: 'Описание места'
    })
    @IsDefined()
    @IsString()
    readonly description: string;

    @ApiProperty({
        example: 'e87fed1c-060e-4da6-b7de-e27e0b1cc5c9.jpg',
        description: 'Название картинки, сохраненной на сервере'
    })
    @IsDefined()
    @IsString()
    readonly image: string;

    @ApiProperty({
        example: 'Театральная площадь, 1',
        description: 'Адрес точки'
    })
    @IsDefined()
    @IsString()
    readonly address: string;

    @ApiProperty({
        example: 'Москва',
        description: 'Город точки'
    })
    @IsDefined()
    @IsString()
    readonly city: string;

    @ApiProperty({
        example: '55.760452',
        description: 'Широта',
        type: 'number'
    })
    @IsDefined()
    @IsNumber()
    readonly latitude: string;

    @IsDefined()
    @IsNumber()
    @ApiProperty({
        example: '37.618373',
        description: 'Долгота',
        type: 'number'
    })
    readonly longitude: string;
}