import {ApiProperty} from "@nestjs/swagger";

export class CreateExcursionResponseDto {
    @ApiProperty({example: '1', description: 'id созданной экскурсии в БД'})
    readonly id: number;

    @ApiProperty({example: 'Интересная Москва', description: 'Заголовок созданной экскурсии'})
    readonly title: string;
}
