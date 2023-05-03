import {Body, Controller, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {SetRoleDto} from "./dto/set-role.dto";
import {BodyWithValidation} from "../decorators";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {API_V1, USERS_TAG} from "../constrants";
import {Request} from "express";
import {AddUserImageDto} from "./dto/add-user-ymage.dto";

@ApiTags(USERS_TAG)
@Controller(`${API_V1}/${USERS_TAG}`)
export class UsersController {

    constructor(private userService: UsersService) {}

    // @ApiOperation({summary: "Создание пользователя"})
    // @ApiResponse({status: 200, type: User})
    // @Post()
    create(@BodyWithValidation() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    @ApiOperation({
        summary: "Получение всех пользователей"
    })
    @ApiResponse({
        status: 200,
        type: [User]
    })
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.userService.getAllUsers();
    }

    @ApiOperation({
        summary: "Прикрепление картинки к пользователю"
    })
    @ApiResponse({
        status: 200,
    })
    @UseGuards(JwtAuthGuard)
    @Post('set_image')
    setUserImage(@BodyWithValidation() dto: AddUserImageDto,
                 @Req() req: Request) {
        const user = req.body.user;
        return this.userService.setUserImage(dto, user.id);
    }

    @ApiOperation({
        summary: "Выдача роли по значению"
    })
    @ApiResponse({
        status: 200,
        type: Role
    })
    @Patch('set_role')
    setRoleByValue(@BodyWithValidation() setRoleDto: SetRoleDto) {
        return this.userService.setRoleByValue(setRoleDto);
    }
}
