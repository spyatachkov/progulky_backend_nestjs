import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {LoginUserDto} from "../users/dto/login-user.dto";
import {BodyWithValidation} from "../decorators";
import {RequestNewTokenPairDto} from "./dto/request-new-token-pair.dto";
import {NewTokenInfo} from "./dto/new-token-info.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {Request} from "express";
import {UserInfoInstanceDto} from "../users/dto/user-info.dto";
import {API_V1, AUTH_TAG} from "../constrants";

@ApiTags(AUTH_TAG)
@Controller(`${API_V1}/${AUTH_TAG}`)
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({
        summary: "Авторизация (вход)"
    })
    @ApiResponse({
        status: 200,
        type: NewTokenInfo
    })
    @Post('/login')
    login(@BodyWithValidation() userDto: LoginUserDto) {
        return this.authService.login(userDto);
    }

    @ApiOperation({
        summary: 'Обновление пары токенов',
        description: 'Передается refresh, он стирается из базы, выдается новая пара access + refresh'
    })
    @ApiResponse({
        status: 200,
        type: NewTokenInfo
    })
    @Post('/token/refresh')
    refreshToken(@BodyWithValidation() dto: RequestNewTokenPairDto) {
        return this.authService.refresh(dto);
    }

    @ApiOperation({
        summary: "Получение информации о себе"
    })
    @ApiResponse({
        status: 200,
        type: UserInfoInstanceDto
    })
    @Get('/me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req: Request) {
        const user = req.body.user;
        return this.authService.me(user.id);
    }

    @ApiOperation({
        summary: "Регистрация"
    })
    @ApiResponse({
        status: 200,
        type: NewTokenInfo
    })
    @Post('/registration')
    registration(@BodyWithValidation() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }
}
