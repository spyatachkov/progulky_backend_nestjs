import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from "path";
import * as fs from 'fs';
import * as uuid from 'uuid';


@Injectable()
export class FilesService {

    // Добавление картинки экскурсии
    async createFile(file): Promise<string> {
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '..', 'static/images/excursions');
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
            const placeFilePath = path.resolve(__dirname, '..', 'static/images/places');
            if (!fs.existsSync(placeFilePath)) {
                fs.mkdirSync(placeFilePath, {recursive: true});
            }
            fs.writeFileSync(path.join(placeFilePath, placeFileName), file.buffer);
            return placeFileName;
        } catch (e) {
            throw new HttpException('Ошибка при записи файла места', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
