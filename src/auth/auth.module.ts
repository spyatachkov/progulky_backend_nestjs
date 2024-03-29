import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {SequelizeModule} from "@nestjs/sequelize";
import {TokenPair} from "./entities/tokenpair.model";

import settings from "../settings/entities/settings";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      forwardRef(() => UsersModule),
      SequelizeModule.forFeature([TokenPair]),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || 'SECRET',
        signOptions: {
          expiresIn: settings.expiresAt,
        }
      })
  ],
    exports: [AuthService, JwtModule]
})
export class AuthModule {}
