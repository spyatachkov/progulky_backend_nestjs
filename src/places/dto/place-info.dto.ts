import {ApiProperty} from "@nestjs/swagger";

export class PlaceInfoDto {
    constructor(id,
                title,
                description,
                image,
                address,
                city,
                latitude,
                longitude) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.address = address;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    @ApiProperty({example: '1', description: 'Уникальный идетификатор'})
    readonly id: number

    @ApiProperty({example: 'Большой театр', description: 'Заголовок точки'})
    readonly title: string;

    @ApiProperty({example: 'Самый большой театр в стране. Поэтому и называется большой', description: 'Описание места'})
    readonly description: string;

    @ApiProperty({example: 'picture.jpg', description: 'Название картинки на диске'})
    readonly image: string;

    @ApiProperty({example: 'Театральная площадь, 1', description: 'Адрес точки'})
    readonly address: string;

    @ApiProperty({example: 'Москва', description: 'Город точки'})
    readonly city: string;

    @ApiProperty({example: '55.760452', description: 'Широта'})
    readonly latitude: string;

    @ApiProperty({example: '37.618373', description: 'Долгота'})
    readonly longitude: string;
}
