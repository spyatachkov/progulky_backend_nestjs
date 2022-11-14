import {ApiProperty} from "@nestjs/swagger";
import {UserInfoInstanceDto} from "../../users/dto/user-info.dto";
import {PlaceInfoDto} from "../../places/dto/place-info.dto";

//  Полная Dto в которой экскурсия возвращается со всеми её точками
export class ExtendedExcursionInstanceDto {
    @ApiProperty({example: 'Интересная Москва', description: 'Заголовок экскурсии'})
    readonly title: string;

    @ApiProperty({example: 'Интерересное описание экскурсии', description: 'Описание экскурсии'})
    readonly description: string;

    @ApiProperty({example: '1', description: 'Id пользователя, который создал экскурсию'})
    readonly ownerId: number;

    @ApiProperty({example: 'picture.jpg', description: 'Название файла на диске'})
    readonly image: string;

    @ApiProperty({example: '4.91', description: 'Рейтинг экскурсии'})
    readonly rating: number;

    @ApiProperty({example: '60', description: 'Продолжительность экскурсии (мин)'})
    readonly duration: string;

    @ApiProperty({example: '3.3', description: 'Расстояние всего маршрута (км)'})
    readonly distance: number;

    @ApiProperty({example: UserInfoInstanceDto, description: 'Владелец (создатель) экскурсии'})
    readonly owner: UserInfoInstanceDto;

    @ApiProperty({example: PlaceInfoDto, description: 'Точки пренадлежащие этой экскурсии'})
    readonly places: PlaceInfoDto;
}