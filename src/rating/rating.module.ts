import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Rating} from "./rating.model";
import {Excursion} from "../excursions/excursions.model";
import {User} from "../users/users.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [RatingService],
  controllers: [RatingController],
  imports: [
      SequelizeModule.forFeature([User, Excursion, Rating]),
      AuthModule,
  ]
})
export class RatingModule {}
