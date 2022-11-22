import { Injectable } from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {SetRoleDto} from "./dto/set-role.dto";
import {UserInfoInstanceDto} from "./dto/user-info.dto";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService) {
    }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue('user');
        await user.$set('role', role.id);
        user.role = role;
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }

    async getUserById(id: number) {
        const u = await this.userRepository.findOne({where: {id}, include: {all: true}});
        const user: UserInfoInstanceDto = {
            id: u.id,
            name: u.name,
            email: u.email,
            role: {
                id: u.role.id,
                value: u.role.value,
                description: u.role.description,
            },
        }
        //const user = await this.userRepository.findByPk(id);
        return user;
    }

    async setRoleByValue(setRoleDto: SetRoleDto) {
        User.findOne({where: {email: setRoleDto.email}}).then((user) => {
            user.roleId = setRoleDto.roleId;
            return user.save();
        });
    }
}
