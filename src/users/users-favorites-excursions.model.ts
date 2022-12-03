import {
    Column,
    DataType, ForeignKey, HasOne,
    Model,
    Table
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Excursion} from "../excursions/excursions.model";
import {User} from "./users.model";

// Таблица с экскурсиями, которые пользователь добавил к себе в избранное
@Table({tableName: 'favorites_excursions', createdAt: false, updatedAt: false})
export class UsersFavoritesExcursions extends Model<UsersFavoritesExcursions> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '2', description: 'id пользователя'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ApiProperty({example: '3', description: 'id экскурсии'})
    @ForeignKey(() => Excursion)
    @Column({type: DataType.INTEGER})
    excursionId: number;
}
