import {ApiProperty} from "@nestjs/swagger";
import {UserInfoInstanceDto} from "../../users/dto/user-info.dto";

// Краткая информация об экскурсии
export class ShortExcursionInstanceDto {

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
        example: UserInfoInstanceDto,
        description: 'Владелец (создатель) экскурсии'})
    readonly owner: UserInfoInstanceDto;
}