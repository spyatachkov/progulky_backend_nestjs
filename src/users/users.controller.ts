import {Body, Controller, Get, Param, Patch, Post, Req} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {SetRoleDto} from "./dto/set-role.dto";
import {BodyWithValidation} from "../decorators";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    // @ApiOperation({summary: "Создание пользователя"})
    // @ApiResponse({status: 200, type: User})
    // @Post()
    create(@BodyWithValidation() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    @ApiOperation({summary: "Получение всех пользователей"})
    @ApiResponse({status: 200, type: [User]})
    @Get()
    getAll() {
        return this.userService.getAllUsers();
    }

    @ApiOperation({summary: "Выдача роли по значению"})
    @ApiResponse({status: 200, type: Role})
    @Patch('set_role')
    setRoleByValue(@BodyWithValidation() setRoleDto: SetRoleDto) {
        return this.userService.setRoleByValue(setRoleDto);
    }
}
