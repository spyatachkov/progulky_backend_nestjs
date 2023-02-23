import {Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiConsumes, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FilesService} from "./files.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {AddImageResponse} from "./interfaces";

@ApiTags('Файлы')
@Controller('files')
export class FilesController {

    constructor(private filesService: FilesService) {
    }

    @Post('excursion')
    @ApiOperation({
        summary: "Загрузка картинки экскурсии"
    })
    @ApiResponse({
        status: 200,
        type: AddImageResponse
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    uploadExcursionImage(@UploadedFile() image): Promise<AddImageResponse> {
        return this.filesService.addExcursionImage(image);
    }

    @Post('place')
    @ApiOperation({
        summary: "Загрузка картинки места"
    })
    @ApiResponse({
        status: 200,
        type: AddImageResponse
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    uploadPlaceImage(@UploadedFile() image): Promise<AddImageResponse> {
        return this.filesService.addPlaceImage(image);
    }
}
