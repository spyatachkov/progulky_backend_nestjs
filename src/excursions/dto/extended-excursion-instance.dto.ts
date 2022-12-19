import {ApiProperty} from "@nestjs/swagger";
import {UserInfoInstanceDto} from "../../users/dto/user-info.dto";
import {PlaceInfoDto} from "../../places/dto/place-info.dto";

//  Полная Dto в которой экскурсия возвращается со всеми её точками
export class ExtendedExcursionInstanceDto {
    constructor(id,
                title,
                description,
                isFavorite,
                ownerId,
                ownerRoleValue,
                image,
                rating,
                duration,
                distance,
                numberOfPoints,
                owner,
                places) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.isFavorite = isFavorite;
        this.ownerId = ownerId;
        this.ownerRoleValue = ownerRoleValue;
        this.image = image;
        this.rating = rating;
        this.duration = duration;
        this.distance = distance;
        this.numberOfPoints = numberOfPoints;
        this.owner = owner;
        this.places = places;
    }

    @ApiProperty({example: '1', description: 'Идентификатор'})
    readonly id: number;

    @ApiProperty({example: 'Интересная Москва', description: 'Заголовок экскурсии'})
    readonly title: string;

    @ApiProperty({example: 'Интерересное описание экскурсии', description: 'Описание экскурсии'})
    readonly description: string;

    @ApiProperty({example: 'true', description: 'Если - true, то экскурсия есть в избранном'})
    isFavorite: boolean;

    @ApiProperty({example: '1', description: 'Id пользователя, который создал экскурсию'})
    readonly ownerId: number;

    @ApiProperty({example: 'user', description: 'Роль пользователя, кто создал экскурсию'})
    readonly ownerRoleValue: string;

    @ApiProperty({example: 'picture.jpg', description: 'Название файла на диске'})
    readonly image: string;

    @ApiProperty({example: '4.91', description: 'Рейтинг экскурсии'})
    readonly rating: number;

    @ApiProperty({example: '60', description: 'Продолжительность экскурсии (мин)'})
    readonly duration: number;

    @ApiProperty({example: '3.3', description: 'Расстояние всего маршрута (км)'})
    readonly distance: number;

    @ApiProperty({example: '3', description: 'Количество точек в маршруте'})
    readonly numberOfPoints: string;

    @ApiProperty({example: UserInfoInstanceDto, description: 'Владелец (создатель) экскурсии'})
    readonly owner: UserInfoInstanceDto;

    @ApiProperty({example: PlaceInfoDto, description: 'Точки пренадлежащие этой экскурсии'})
    readonly places: PlaceInfoDto;
}