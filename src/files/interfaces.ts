import {ApiProperty} from "@nestjs/swagger";

export class AddImageResponse {
    @ApiProperty({
        description: 'Ответ при загрузки картинки',
    })
    public fileName: string;
}