import { Injectable } from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {SetRoleDto} from "./dto/set-role.dto";
import {UserInfoInstanceDto} from "./dto/user-info.dto";
import {UsersFavoritesExcursions} from "./users-favorites-excursions.model";
import {GetFavoritesExcursionsDto} from "./dto/get-favorites-excursions.dto";
import {Excursion} from "../excursions/excursions.model";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(UsersFavoritesExcursions) private favoritesExcursionsRepository: typeof UsersFavoritesExcursions,
                @InjectModel(Excursion) private excursionsRepository: typeof Excursion,
                private roleService: RolesService,
    ) {
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

    // Получение избранных экскурсий для пользователя чей id передается в DTO
    async getFavoritesExcursions(dto: GetFavoritesExcursionsDto) {

        const favoritesExcursionsModelByUserId = await this.favoritesExcursionsRepository.findAll({where: {userId: dto.userId}, include: {all: true}});
        const favoritesExcursionsIds = favoritesExcursionsModelByUserId.map((f) => f.excursionId); // id избранных экскурсий пользователя

        let favoritesExcursions: Excursion[] = [];

        for (let i of favoritesExcursionsIds) {
            // TODO: селектить так - это быдлота. надо делать красиво, но я пока не знаю как
            const fe = await this.excursionsRepository.findByPk(i, {include: {all: true}})
            favoritesExcursions.push(fe);
        }
        return favoritesExcursions.map((e) => Excursion.toObj(e))
    }

    async setRoleByValue(setRoleDto: SetRoleDto) {
        User.findOne({where: {email: setRoleDto.email}}).then((user) => {
            user.roleId = setRoleDto.roleId;
            return user.save();
        });
    }
}
