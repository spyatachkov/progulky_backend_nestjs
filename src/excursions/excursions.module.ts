import { Module } from '@nestjs/common';
import { ExcursionsService } from './excursions.service';
import { ExcursionsController } from './excursions.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Excursion} from "./excursions.model";
import {Place} from "../places/places.model";
import {ExcursionPlaces} from "../places/excursion-place.model";
import {UsersModule} from "../users/users.module";

@Module({
  providers: [ExcursionsService],
  controllers: [ExcursionsController],
  imports: [
    SequelizeModule.forFeature([Excursion, Place, ExcursionPlaces]),
    UsersModule,
  ],
})
export class ExcursionsModule {}
