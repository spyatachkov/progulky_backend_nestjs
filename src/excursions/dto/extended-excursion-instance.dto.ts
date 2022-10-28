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

    @ApiProperty({example: 'site.com/image/pic/pig.img', description: 'Путь до файла с картинкой экскурсии'})
    readonly imagePath: string;

    @ApiProperty({example: '4.91', description: 'Рейтинг экскурсии'})
    readonly rating: number;

    @ApiProperty({example: '2 часа', description: 'Продолжительность экскурсии'})
    readonly duration: string;

    @ApiProperty({example: UserInfoInstanceDto, description: 'Владелец (создатель) экскурсии'})
    readonly owner: UserInfoInstanceDto;

    @ApiProperty({example: PlaceInfoDto, description: 'Точки пренадлежащие этой экскурсии'})
    readonly places: PlaceInfoDto;
}