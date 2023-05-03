import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {Excursion} from "../excursions/excursions.model";
import {UsersFavoritesExcursions} from "./users-favorites-excursions.model";
import {UserInfoInstanceDto} from "./dto/user-info.dto";
import {Rating} from "../rating/rating.model";

interface UserCreationAttrs {
    name: string;
    email: string;
    password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
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
        example: 'user@email.ru',
        description: 'Почта'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string;

    @ApiProperty({
        example: 'Иван',
        description: 'Имя'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string;

    @ApiProperty({
        example: '12345',
        description: 'Пароль'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string;

    @ApiProperty({
        example: 'false',
        description: 'Не забанен'
    })
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    banned: boolean;

    @ApiProperty({
        example: null,
        description: 'Описание причины бана'
    })
    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    banReason: string;

    @ApiProperty({
        example: '0000-0000-0000-000.jpg',
        description: 'uuid картинки, которая хранится в директории с аватарами пользователя'
    })
    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    image: string;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER})
    roleId: number;

    @BelongsTo(() => Role)
    role: Role;

    @BelongsToMany(() => Excursion, () => UsersFavoritesExcursions)
    favoritesExcursions: Excursion[];

    @HasMany(() => Rating)
    ratings: Rating[];

    // Перевод модели в объект юзера
    static getUserInfo(u: User): UserInfoInstanceDto {
        return  {
            id: u.id,
            name: u.name,
            email: u.email,
            image: u.image,
            role: {
                id: u.role.id,
                value: u.role.value,
                description: u.role.description,
            },
        };
    }
}
