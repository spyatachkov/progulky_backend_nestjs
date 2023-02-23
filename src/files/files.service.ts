import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from "path";
import * as fs from 'fs';
import * as uuid from 'uuid';
import {AddImageResponse} from "./interfaces";


@Injectable()
export class FilesService {

    // Добавление картинки экскурсии
    async createFile(file): Promise<string> {
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '../../../', 'files/images/excursions'); // файлы сохраняются в папку на диске рядом с проектом
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return fileName;
        } catch (e) {
            throw new HttpException('Ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Добавление картинки места
    async createPlaceFile(file): Promise<string> {
        try {
            const placeFileName = uuid.v4() + '.jpg';
            const placeFilePath = path.resolve(__dirname, '../../../', 'files/images/places'); // файлы сохраняются в папку на диске рядом с проектом
            if (!fs.existsSync(placeFilePath)) {
                fs.mkdirSync(placeFilePath, {recursive: true});
            }
            fs.writeFileSync(path.join(placeFilePath, placeFileName), file.buffer);
            return placeFileName;
        } catch (e) {
            throw new HttpException('Ошибка при записи файла места', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Добавление картинки экскурсии
    async addExcursionImage(file): Promise<AddImageResponse> {
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '../../../', 'files/images/excursions'); // файлы сохраняются в папку на диске рядом с проектом
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);

            return {
                fileName: fileName
            }
        } catch (e) {
            throw new HttpException('Ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Добавление картинки места
    async addPlaceImage(file): Promise<AddImageResponse> {
        try {
            const placeFileName = uuid.v4() + '.jpg';
            const placeFilePath = path.resolve(__dirname, '../../../', 'files/images/places'); // файлы сохраняются в папку на диске рядом с проектом
            if (!fs.existsSync(placeFilePath)) {
                fs.mkdirSync(placeFilePath, {recursive: true});
            }
            console.log(placeFilePath);
            fs.writeFileSync(path.join(placeFilePath, placeFileName), file.buffer);

            return {
                fileName: placeFileName
            }
        } catch (e) {
            throw new HttpException('Ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
