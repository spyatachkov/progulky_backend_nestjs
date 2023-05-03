import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType, ForeignKey,
    Model,
    Table
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Excursion} from "../excursions/excursions.model";
import {User} from "../users/users.model";
import {Role} from "../roles/roles.model";

interface RatingCreationAttrs {
    rating: number;
    excursionId: number,
    userId: number
    comment?: string;
}

@Table({
    tableName: 'rating',
    indexes: [
        {
            unique: true,
            fields: ['excursionId', 'userId']
        }
    ],
})
export class Rating extends Model<Rating, RatingCreationAttrs> {
    @ApiProperty({
        example: '1',
        description: 'Уникальный идентификатор'
    })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @ApiProperty({
        description: 'Комментарий к оценке'
    })
    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    comment: string;

    @ApiProperty({
        example: 5,
        description: 'Оценка'
    })
    @Column({
            type: DataType.INTEGER,
            allowNull: false
        })
    rating: number;

    @ApiProperty({
        example: 1,
        description: 'id экскурсии'
    })
    @ForeignKey(() => Excursion)
    @Column({
        type: DataType.INTEGER,
    })
    excursionId: number;

    @ApiProperty({
        example: 1,
        description: 'id пользователя, который поставил оценку'
    })
    @Column({
        type: DataType.INTEGER,
    })
    @ForeignKey(() => User)
    userId: number;

    @BelongsTo(() => Excursion)
    excursion: Excursion;

    @BelongsTo(() => User)
    user: User;
}
