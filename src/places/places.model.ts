import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Excursion} from "../excursions/excursions.model";
import {ExcursionPlaces} from "./excursion-place.model";
import {ExtendedPlaceInfoDto} from "./dto/extended-place-info.dto";
import {ShortPlaceInfoDto} from "./dto/short-place-info.dto";

interface PlaceCreationAttrs {
    title: string;
    description: string;
    image: string;
    sort: number;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
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
    @Column({type: DataType.DOUBLE, allowNull: false})
    latitude: number;

    // Долгота
    @ApiProperty({example: '37.618373', description: 'Долгота'})
    @Column({type: DataType.DOUBLE, allowNull: false})
    longitude: number;

    @BelongsToMany(() => Excursion, () => ExcursionPlaces)
    excursions: Excursion[];

    static toObj(place: Place, sort: number) {
        return {
            sort: sort + 1,
            title: place.title,
            description: place.description,
            image: place.image,
            address: place.address,
            city: place.city,
            latitude: place.latitude,
            longitude: place.longitude,
        }
    }

    static getShortPlaceInfo(p: Place): ShortPlaceInfoDto {
        return  {
            id: p.id,
            sort: null,
            title: p.title,
            address: p.address,
            latitude: p.latitude,
            longitude: p.longitude,
        };
    }

    static getExtendedPlaceInfo(p: Place): ExtendedPlaceInfoDto {
        return  {
            id: p.id,
            title: p.title,
            description: p.description,
            image: p.image,
            address: p.address,
            city: p.city,
            latitude: p.latitude,
            longitude: p.longitude,
        };
    }

    // делает из модели объект, который возвращается в списке всех добавленных в базу мест
    // ручка GET /places
    static toInfoPlaceInstance(place: Place) {
        return {
            id: place.id,
            title: place.title,
            description: place.description,
            image: place.image,
            address: place.address,
            city: place.city,
            latitude: place.latitude,
            longitude: place.longitude,
        }
    }
}
