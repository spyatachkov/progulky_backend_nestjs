import {Body, HttpException, HttpStatus, Injectable, Post, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../users/users.model";
import * as bcrypt from 'bcryptjs';
import {UserAuthInstanceDto} from "../users/dto/user-auth.dto";
import {LoginUserDto} from "../users/dto/login-user.dto";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService) {}

    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto);
        const token = await this.generateToken(user);
        return this.generateAuthUserInstance(user, token.token);
    }

    async registration(userDto: CreateUserDto) {
        const pre_user = await this.userService.getUserByEmail(userDto.email);
        if (pre_user) {
            throw new HttpException("Пользователь с такими email уже существует", HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword});
        const token = await this.generateToken(user);

        return this.generateAuthUserInstance(user, token.token);
    }

    // Сборка объекта пользователя из его данных и его токена
    private generateAuthUserInstance(user: User, token: string) {
        const userAuthInstance: UserAuthInstanceDto = {
            id: user.id,
            token: token,
            name: user.name,
            role: {
                id: user.role.id,
                value: user.role.value,
                description: user.role.description,
            },
            email: user.email,
        };
        return userAuthInstance;
    }

    private async generateToken(user: User) {
        const payload = {id: user.id, name: user.name, email: user.email, roles: user.role};
        return {
            token: this.jwtService.sign(payload),
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);

        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный email или пароль'})
    }

    private async getUserById(id: number) {
        const user = await this.userService.getUserById(id);
        return user;
    }
}
