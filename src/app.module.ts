import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import { AuthModule } from './auth/auth.module';
import { ExcursionsModule } from './excursions/excursions.module';
import { PlacesModule } from './places/places.module';
import {Excursion} from "./excursions/excursions.model";
import {Place} from "./places/places.model";
import {ExcursionPlaces} from "./places/excursion-place.model";
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`
        }),
        ServeStaticModule.forRoot({
           rootPath: path.resolve(__dirname, 'static'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRESS_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRESS_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, Excursion, Place, ExcursionPlaces],
            autoLoadModels: true,
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        ExcursionsModule,
        PlacesModule,
        FilesModule,
    ],
})
export class AppModule {}