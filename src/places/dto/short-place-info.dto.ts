import {ApiProperty} from "@nestjs/swagger";

// Сжатая (короткая) информация о месте
export class ShortPlaceInfoDto {

    @ApiProperty({
        example: '1',
        description: 'Уникальный идетификатор'
    })
    readonly id: number

    @ApiProperty({
        example: '1',
        description: 'Порядковый номер места в экскурсии'
    })
    sort?: number

    @ApiProperty({
        example: 'Большой театр',
        description: 'Заголовок точки'
    })
    readonly title: string;


    @ApiProperty({
        example: 'Театральная площадь, 1',
        description: 'Адрес точки'
    })
    readonly address: string;

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
