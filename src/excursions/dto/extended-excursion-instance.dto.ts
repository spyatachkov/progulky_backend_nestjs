import {ApiProperty} from "@nestjs/swagger";
import {UserInfoInstanceDto} from "../../users/dto/user-info.dto";
import {ShortPlaceInfoDto} from "../../places/dto/short-place-info.dto";

//  Полная Dto в которой экскурсия возвращается со всеми её точками
export class ExtendedExcursionInstanceDto {

    @ApiProperty({
        example: '1',
        description: 'Идентификатор'
    })
    readonly id: number;

    @ApiProperty({
        example: 'Интересная Москва',
        description: 'Заголовок экскурсии'
    })
    readonly title: string;

    @ApiProperty({
        example: 'Интерересное описание экскурсии',
        description: 'Описание экскурсии'
    })
    readonly description: string;

    @ApiProperty({
        example: 'true',
        description: 'Если - true, то экскурсия есть в избранном'
    })
    isFavorite: boolean;

    @ApiProperty({
        example: 'picture.jpg',
        description: 'Название файла на диске'
    })
    readonly image: string;

    @ApiProperty({
        example: '4.91',
        description: 'Рейтинг экскурсии'
    })
    readonly rating: number;

    @ApiProperty({
        example: '60',
        description: 'Продолжительность экскурсии (мин)'
    })
    readonly duration: number;

    @ApiProperty({
        example: '3.3',
        description: 'Расстояние всего маршрута (км)'
    })
    readonly distance: number;

    @ApiProperty({
        example: '3',
        description: 'Количество точек в маршруте'
    })
    readonly numberOfPoints: number;

    @ApiProperty({
        type: UserInfoInstanceDto,
        description: 'Владелец (создатель) экскурсии'
    })
    readonly owner: UserInfoInstanceDto;

    @ApiProperty({
        type: [ShortPlaceInfoDto],
        description: 'Точки пренадлежащие этой экскурсии'
    })
    places: ShortPlaceInfoDto[];
}