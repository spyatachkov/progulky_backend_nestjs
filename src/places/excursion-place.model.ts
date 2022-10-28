import {
    Column,
    DataType, ForeignKey, HasOne,
    Model,
    Table
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Place} from "./places.model";
import {Excursion} from "../excursions/excursions.model";

@Table({tableName: 'excursion_places', createdAt: false, updatedAt: false})
export class ExcursionPlaces extends Model<ExcursionPlaces> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: '2', description: 'id места'})
    @ForeignKey(() => Place)
    @Column({type: DataType.INTEGER})
    placeId: number;

    @ApiProperty({example: '3', description: 'id экскурсии'})
    @ForeignKey(() => Excursion)
    @Column({type: DataType.INTEGER})
    excursionId: number;

    @ApiProperty({example: '2', description: 'Номер точки по порядку в экскурсии с этим id'})
    @Column({type: DataType.INTEGER})
    sort: number;
}
