import {ApiProperty} from "@nestjs/swagger";

// Расширенная (полная) информация о месте
export class ExtendedPlaceInfoDto {

    @ApiProperty({
        example: '1',
        description: 'Уникальный идетификатор'
    })
    readonly id: number

    @ApiProperty({
        example: 'Большой театр',
        description: 'Заголовок точки'
    })
    readonly title: string;

    @ApiProperty({
        example: 'Самый большой театр в стране. Поэтому и называется большой',
        description: 'Описание места'
    })
    readonly description: string;

    @ApiProperty({
        example: 'picture.jpg',
        description: 'Название картинки на диске'
    })
    readonly image: string;

    @ApiProperty({
        example: 'Театральная площадь, 1',
        description: 'Адрес точки'
    })
    readonly address: string;

    @ApiProperty({
        example: 'Москва',
        description: 'Город точки'
    })
    readonly city: string;

    @ApiProperty({
        example: '55.760452',
        description: 'Широта'
    })
    readonly latitude: number;

    @ApiProperty({
        example: '37.618373',
        description: 'Долгота'
    })
    readonly longitude: number;
}
