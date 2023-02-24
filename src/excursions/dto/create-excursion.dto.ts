import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNumber, IsNumberString, IsString} from "class-validator";

export class CreateExcursionDto {
    @ApiProperty({
        example: 'Интересная Москва',
        description: 'Заголовок экскурсии'
    })
    @IsDefined()
    @IsString()
    readonly title: string;

    @ApiProperty({
        example: 'Интерересное описание экскурсии',
        description: 'Описание экскурсии'
    })
    @IsDefined()
    @IsString()
    readonly description: string;

    @IsDefined()
    @IsString()
    @ApiProperty({
        example: 'e87fed1c-060e-4da6-b7de-e27e0b1cc5c9.jpg',
        description: 'Название картинки, сохраненной на сервере'
    })
    readonly image: string;

    @ApiProperty({
        example: '60',
        description: 'Продолжительность экскурсии (мин)',
        type: "number"
    })
    @IsDefined()
    @IsNumber()
    readonly duration: string;

    @ApiProperty({
        example: '3.3',
        description: 'Расстояние всего маршрута (км)',
        type: "number"
    })
    @IsDefined()
    @IsNumber()
    readonly distance: string;

    @ApiProperty({
        example: '1, 2, 4, 6',
        description: 'Строка id-шников мест, которые относятся к этой экскурсии (в порядке на маршруте)'}
    )
    @IsDefined()
    @IsString()
    readonly placesIds: string;
}
