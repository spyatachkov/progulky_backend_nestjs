import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Place} from "./places.model";
import {Excursion} from "../excursions/excursions.model";
import {ExcursionPlaces} from "./excursion-place.model";
import {User} from "../users/users.model";
import {FilesModule} from "../files/files.module";

@Module({
  controllers: [PlacesController],
  providers: [PlacesService],
  imports: [
    SequelizeModule.forFeature([User, Place, Excursion, ExcursionPlaces]),
    FilesModule
  ],
})
export class PlacesModule {}
