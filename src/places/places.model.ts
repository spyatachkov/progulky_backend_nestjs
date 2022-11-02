import {
    BelongsToMany,
    Column,
    DataType, HasOne,
    Model,
    Table
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Excursion} from "../excursions/excursions.model";
import {ExcursionPlaces} from "./excursion-place.model";

interface PlaceCreationAttrs {
    title: string;
    description: string;
    image: string;
    sort: number;
    address: string;
    city: string;
    latitude: string;
    longitude: string;
}

@Table({tableName: 'places'})
export class Place extends Model<Place, PlaceCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Большой театр', description: 'Название места'})
    @Column({type: DataType.TEXT, allowNull: true})
    title: string;

    @ApiProperty({example: 'Самый большой театр в стране. Поэтому и называется большой', description: 'Описание места'})
    @Column({type: DataType.TEXT, allowNull: true})
    description: string;

    @ApiProperty({example: 'pig.img', description: 'Название картинки'})
    @Column({type: DataType.TEXT, allowNull: true})
    image: string;

    @ApiProperty({example: 'Театральная площадь, 1', description: 'Адрес места'})
    @Column({type: DataType.TEXT, allowNull: true})
    address: string;

    @ApiProperty({example: 'Москва', description: 'Город места'})
    @Column({type: DataType.STRING, allowNull: true})
    city: string;

    // Широта
    @ApiProperty({example: '55.760452', description: 'Широта'})
    @Column({type: DataType.STRING, allowNull: false})
    latitude: string;

    // Долгота
    @ApiProperty({example: '37.618373', description: 'Долгота'})
    @Column({type: DataType.STRING, allowNull: false})
    longitude: string;

    @BelongsToMany(() => Excursion, () => ExcursionPlaces)
    excursions: Excursion[];

    @HasOne(() => ExcursionPlaces, 'sort')
    sort: number;

    static toObj(place: Place) {
        return {
            title: place.title,
            description: place.description,
            imagePath: place.image,
            address: place.address,
            city: place.city,
            latitude: place.latitude,
            longitude: place.longitude,
        }
    }
}
