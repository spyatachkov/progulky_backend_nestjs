import {Body, Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {UserAuthInstanceDto} from "../users/dto/user-auth.dto";
import {LoginUserDto} from "../users/dto/login-user.dto";
import {BodyWithValidation} from "../decorators";

@ApiTags('Авторизация и регистрация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: "Авторизация (вход)"})
    @ApiResponse({status: 200, type: UserAuthInstanceDto})
    @Post('/login')
    login(@Body() userDto: LoginUserDto) {
        return this.authService.login(userDto);
    }

    @ApiOperation({summary: "Регистрация"})
    @ApiResponse({status: 200, type: UserAuthInstanceDto})
    @Post('/registration')
    registration(@BodyWithValidation() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }
}
