import {ApiProperty} from "@nestjs/swagger";

export class CreatePlaceDto {
    @ApiProperty({example: 'Большой театр', description: 'Заголовок точки'})
    readonly title: string;

    @ApiProperty({example: 'Самый большой театр в стране. Поэтому и называется большой', description: 'Описание места'})
    readonly description: string;

    @ApiProperty({example: 'site.com/image/pic/pig.img', description: 'URL картикни'})
    readonly imagePath: string;

    @ApiProperty({example: 'Театральная площадь, 1', description: 'Адрес точки'})
    readonly address: string;

    @ApiProperty({example: 'Москва', description: 'Город точки'})
    readonly city: string;

    @ApiProperty({example: '55.760452', description: 'Широта'})
    readonly latitude: string;

    @ApiProperty({example: '37.618373', description: 'Долгота'})
    readonly longitude: string;
}