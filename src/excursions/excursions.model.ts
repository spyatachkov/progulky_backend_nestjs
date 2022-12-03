import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";
import {User} from "../users/users.model";
import {ApiProperty} from "@nestjs/swagger";
import {Place} from "../places/places.model";
import {ExcursionPlaces} from "../places/excursion-place.model";
import {UsersFavoritesExcursions} from "../users/users-favorites-excursions.model";

interface ExcursionCreationAttrs {
    title: string;
    description: string;
    ownerId: number;
    ownerRoleValue: string;
    image: string; // Ссылка на картинку
    duration: number; // Продолжительность в минутах (int)
    distance: number; // Дистанция в километрах (double)
    rating: number; // Рейтинг (double)
    numberOfPoints: number; // Количество точек на маршруте (int)
}

@Table({tableName: 'excursions'})
export class Excursion extends Model<Excursion, ExcursionCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '3', description: 'id пользователя, который создал экскурсию'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    ownerId: number;

    @ApiProperty({example: 'guide', description: 'Роль под которой была создана экскурсия'})
    @Column({type: DataType.STRING, allowNull: true})
    ownerRoleValue: string;

    @BelongsTo(() => User)
    owner: User;

    @ApiProperty({example: 'Интересная Москва', description: 'Название экскурсии'})
    @Column({type: DataType.TEXT, allowNull: false})
    title: string;

    @ApiProperty({example: 'Интерересное описание экскурсии', description: 'Описание экскурсии'})
    @Column({type: DataType.TEXT, allowNull: false})
    description: string;

    @ApiProperty({example: 'pic.jpg', description: 'Название картинки'})
    @Column({type: DataType.TEXT, allowNull: true})
    image: string;

    @ApiProperty({example: '4.91', description: 'Рейтинг экскурсии'})
    @Column({type: DataType.DOUBLE, allowNull: true})
    rating: number;

    @ApiProperty({example: '2', description: 'Продолжительность экскурсии (мин)'})
    @Column({type: DataType.INTEGER, allowNull: true})
    duration: number;

    @ApiProperty({example: '5', description: 'Количество точек на маршруте'})
    @Column({type: DataType.INTEGER, allowNull: true})
    numberOfPoints: number;

    @ApiProperty({example: '3.3', description: 'Дистанция в километрах'})
    @Column({type: DataType.DOUBLE, allowNull: true})
    distance: number;

    @ApiProperty({example: 'true', description: 'Экскурсия не заблокирована'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @BelongsToMany(() => Place, () => ExcursionPlaces)
    places: Place[];

    @BelongsToMany(() => User, () => UsersFavoritesExcursions)
    users: User[];

    static toObj(e: Excursion) {
        return {
            id: e.id,
            title: e.title,
            description: e.description,
            ownerId: e.ownerId,
            image: e.image,
            rating: e.rating,
            duration: e.duration,
            distance: e.distance,
            numberOfPoints: e.numberOfPoints,
            ownerRoleValue: e.ownerRoleValue,
            owner: {
                id: e.owner.id,
                name: e.owner.name,
                email: e.owner.email,
            },
            places: e.places.map((p, sort) => Place.toObj(p, sort)
            ),
        }
    }
}
