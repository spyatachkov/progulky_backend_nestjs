import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {RolesModule} from "../roles/roles.module";
import {UsersFavoritesExcursions} from "./users-favorites-excursions.model";
import {Excursion} from "../excursions/excursions.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Role, UsersFavoritesExcursions, Excursion]),
      RolesModule,
      forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
