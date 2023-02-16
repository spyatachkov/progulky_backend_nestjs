import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

/*
Класс для передачи в декоратор UseGuard() для эндпоинтов.
Проверяет авторизацию пользователя. Если пользователь авторизован
(и токен не протух), то возвращает true и дает возможность выполнить запрос.
Если нет - кидает ошибку.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token) { // Если в хедере в авторизации пришла дичь
                throw new UnauthorizedException({message: 'Ошибка авторизации. Не удалось распознать access-токен'})
            }
            const user = this.jwtService.verify(token);
            req.user = user;
            return true
        } catch (e) {
            throw new UnauthorizedException({message: 'Ошибка авторизации. ' + e.name, statusCode: 401});
        }
    }

}