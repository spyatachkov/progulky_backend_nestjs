import {ApiProperty} from "@nestjs/swagger";
import {UserRoleInstanceDto} from "../../roles/dto/user-role.dto";
import {Role} from "../../roles/roles.model";

// Объект c инфо пользователя
export class UserInfoInstanceDto {
    @ApiProperty({
        example: '1',
        description: 'Идентификатор пользователя'
    })
    id: number;

    @ApiProperty({
        example: 'Паша',
        description: 'Имя'
    })
    name: string;

    @ApiProperty({
        example: 'user@mail.ru',
        description: 'Почта'
    })
    email: string;

    @ApiProperty({
        example: '0000-0000-0000-000.jpg',
        description: 'Название картинки в директории аватарок пользователя'
    })
    image: string;

    @ApiProperty({
        type: UserRoleInstanceDto,
        description: 'Роль'
    })
    role: UserRoleInstanceDto;
}
