import {ApiProperty} from "@nestjs/swagger";
import {UserRoleInstanceDto} from "../../roles/dto/user-role.dto";

// Объект возвращаемый при авторизации и регистрации пользователя
export class UserAuthInstanceDto {
    @ApiProperty({example: 'eyJhbGciOi1NiIsInR5cCIVCJ9.eyJpZCITUsIm5hbWUiOiLQodC10LzQtdC9IiwiZW1haWwiOiJ1c2VyQYWlsLnJ1Ii9sZXMiOnsiaWQiOjMsInZhbHVlIjoidXNlciIsImRlc2NyaXB0aW9uIjoi0J_QvtC70YzQt9C-0LLQsNGC0LXQu9GMIiwiY3JlYXRlZEF0IjoiMjAyMi0xMC0xOVQxNjowNjowNi45NjlaIiwidXBkYXRlZEF0IjoiMjAyMi0xMC0yMFQxMzoxNjoxMC4xOThaIn0sImlhdCI6MTY2NjY5MTAxOCwiZXhwIjoxNjY2Nzc3NDE4fQ.1i_WC_pfx_kb7ljN4hnVGrrnr2eWB_Tv6AiJ4QHq', description: 'Токен доступа'})
    token: string;

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    id: number;

    @ApiProperty({example: 'Паша', description: 'Имя'})
    name: string;

    @ApiProperty({example: 'user@mail.ru', description: 'Почта'})
    email: string;

    @ApiProperty({example: UserRoleInstanceDto, description: 'Id роли которую хотим установить'})
    role: UserRoleInstanceDto;
}
