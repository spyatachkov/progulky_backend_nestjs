import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../users/users.model";
import * as bcrypt from 'bcryptjs';
import {DateTime} from 'luxon';
import {LoginUserDto} from "../users/dto/login-user.dto";
import {NewTokenInfo} from "./dto/new-token-info.dto";
import {nanoid} from "nanoid";
import {InjectModel} from "@nestjs/sequelize";
import {TokenPair} from "./entities/tokenpair.model";
import {RequestNewTokenPairDto} from "./dto/request-new-token-pair.dto";
import settings from "../settings/entities/settings";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService,
                @InjectModel(TokenPair) private tokenPairRepository: typeof TokenPair,
    ) {}

    async login(dto: LoginUserDto) {
        const user = await this.validateUser(dto);
        const tokenPair = await this.generateJwtTokenPair(user.id, dto.deviceFingerprint);

        return tokenPair;
    }

    async refresh(dto: RequestNewTokenPairDto) {
        // Получение пары по рефрешу
        const tokenPair = await this
            .tokenPairRepository
            .findOne(
                {
                    where: {
                        refreshToken: dto.refreshToken,
                        deviceFingerprint: dto.deviceFingerprint,
                    }
                }
            );

        // Если по такому рефрешу не нашлось записи или рефреш протух -> Кидаю ошибку
        if (!tokenPair || DateTime.local() > tokenPair.refreshExpiresAt) {
            throw new UnauthorizedException();
        }

        // Удаляем пару
        await this.tokenPairRepository
            .destroy({
            where: {
                refreshToken: dto.refreshToken,
                deviceFingerprint: dto.deviceFingerprint,
            }
        });

        return this.generateJwtTokenPair(tokenPair.userId, dto.deviceFingerprint);
    }

    async registration(userDto: CreateUserDto) {
        const pre_user = await this.userService.getUserByEmail(userDto.email);
        if (pre_user) {
            throw new HttpException("Пользователь с такими email уже существует", HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword});

        const tokenPair = await this.generateJwtTokenPair(user.id, userDto.deviceFingerprint);

        return tokenPair
    }


    // Получает на вход JWT токен и возвращает объект пользователя
    async verifyToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (e) { // Если ацесс протух, возвращаю 401
            throw new UnauthorizedException(e)
        }
    }

    private async generateToken(user: User) {
        const payload = {id: user.id, name: user.name, email: user.email, roles: user.role};
        return {
            token: this.jwtService.sign(payload),
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (user == null) {
            throw new HttpException("Некорректный email или пароль", HttpStatus.BAD_REQUEST);
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);

        if (user && passwordEquals) {
            return user;
        }
        throw new HttpException("Некорректный email или пароль", HttpStatus.BAD_REQUEST);
    }

    private async generateJwtTokenPair(userId: number, deviceFingerprint: string) {

        const now = DateTime.local();

        const tokenInfo: NewTokenInfo = {
            accessToken: this.jwtService.sign({
                id: userId,
                // Возможно стоит гуид еще какой-нибудь добавить в пейлоад
            }),
            //expiresAt: now.plus({seconds: 60}).toMillis(), // Через сколько истекает ацесс
            refreshToken: nanoid(settings.refreshLength), // Количество символов в рефреше
            refreshExpiresAt: now.plus({seconds: settings.refreshExpiresAt}), // Через сколько истекает рефреш (в секундах) (30 дней = 2592000 сек)
        };

        // TODO: возможно стоит сделать удаление. если генерируется новая пара, то удаляется старая (но тогда при новых входах будет выкидывать из активных сессий)
        // await tokenPairRepository.delete({deviceFingerprint, account});

        await this.tokenPairRepository.create({
                deviceFingerprint: deviceFingerprint,
                accessToken: tokenInfo.accessToken,
                refreshToken: tokenInfo.refreshToken,
                userId: userId,
                refreshExpiresAt: tokenInfo.refreshExpiresAt,
            }
        )

        return tokenInfo;
    }

    public async me(userId: number) {
        return await this.userService.getUserById(userId);
    }

    public async delete(userId: number) {
        return await this.userService.deleteUserById(userId);
    }
}
