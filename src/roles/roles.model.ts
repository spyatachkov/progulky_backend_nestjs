import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";

interface RoleCreationAttrs {
    value: string;
    description: string;
}

@Table({tableName: 'roles'})
export class Role extends Model<User, RoleCreationAttrs> {
    @ApiProperty({example: '2', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'guide', description: 'Тип пользователя (роль)'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    value: string;

    @ApiProperty({example: 'Экскурсовод', description: 'Описание роли'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @HasMany(() => User)
    users: User[];
}
