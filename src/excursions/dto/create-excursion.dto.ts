import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNumber, IsNumberString, IsString} from "class-validator";

export class CreateExcursionDto {
    @ApiProperty({example: 'Интересная Москва', description: 'Заголовок экскурсии'})
    @IsDefined()
    @IsString()
    readonly title: string;

    @ApiProperty({example: 'Интерересное описание экскурсии', description: 'Описание экскурсии'})
    @IsDefined()
    @IsString()
    readonly description: string;

    @ApiProperty({type: 'file', description: 'Файл картинки'})
    readonly image: string;

    @ApiProperty({example: '60', description: 'Продолжительность экскурсии (мин)', type: "number"})
    @IsDefined()
    @IsNumberString()
    readonly duration: string;

    @ApiProperty({example: '3.3', description: 'Расстояние всего маршрута (км)', type: "number"})
    @IsDefined()
    @IsNumberString()
    readonly distance: string;

    @ApiProperty({example: '1, 2, 4, 6', description: 'Строка id-шников мест, которые относятся к этой экскурсии (в порядке на маршруте)'})
    @IsDefined()
    @IsString()
    readonly placesIds: string;
}
