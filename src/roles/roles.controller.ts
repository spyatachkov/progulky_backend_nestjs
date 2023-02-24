import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {Role} from "./roles.model";
import {BodyWithValidation} from "../decorators";
import {API_V1, ROLES_TAG} from "../constrants";

@ApiTags(ROLES_TAG)
@Controller(`${API_V1}/${ROLES_TAG}`)
export class RolesController {
    constructor(private roleService: RolesService) {}

    @ApiOperation({summary: "Создание роли"})
    @ApiResponse({status: 200, type: Role})
    @Post()
    create(@BodyWithValidation() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @ApiOperation({summary: "Получение роли по значению"})
    @ApiResponse({status: 200, type: Role})
    @Get('/:value')
    getByValue(@Param('value') value: string) {
        return this.roleService.getRoleByValue(value);
    }
}
