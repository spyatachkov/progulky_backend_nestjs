import {ApiProperty} from "@nestjs/swagger";

export class AddPlaceDto {
    @ApiProperty({example: '1', description: 'Id места'})
    readonly placeId: number;

    @ApiProperty({example: '2', description: 'Id экскурсии'})
    readonly excursionId: number;

    @ApiProperty({example: '1', description: 'Номер точки по порядку в экскурсии с этим id'})
    readonly sort: number;
}