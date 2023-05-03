import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

export class AddUserImageDto {
    @ApiProperty({
        description: 'Название картинки на сервере в директории image/users'
    })
    @IsDefined()
    @IsString()
    readonly imageName: string;
}
