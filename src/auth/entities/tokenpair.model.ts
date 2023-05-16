import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../users/users.model";

interface TokenPairCreationAttrs {
    deviceFingerprint: string;
    accessToken: string;
    refreshToken: string;
    userId: number;
    refreshExpiresAt: Date;
}

@Table({tableName: 'token_pair'})
export class TokenPair extends Model<TokenPair, TokenPairCreationAttrs> {
    @ApiProperty({
        example: '1',
        description: 'Уникальный идентификатор',
    })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @ApiProperty({
        example: '3',
        description: 'id пользователя, кому пренадлежат токены',
    })
    @ForeignKey(() => User)
    // TODO: тут надо проставлять в базе onDelete: 'CASCADE' onUpdate: 'CASCADE' (я делаю руками в базе) Стоит это иметь в виду
    // TODO: если это не сделать, то при удалении пользваотеля будет 500
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ApiProperty({
        example: 'deviceFingerprint',
        description: 'Идентификатор устройства',
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    deviceFingerprint: string;

    @ApiProperty({
        example: 'access_token',
        description: 'Access-токен',
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    accessToken: string;

    @ApiProperty({
        example: 'refresh_token',
        description: 'Refresh-токен',
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    refreshToken: string;

    @ApiProperty({
        example: '11-11-11',
        description: 'Дата до которой действует рефреш',
    })
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    public refreshExpiresAt: Date;
}
