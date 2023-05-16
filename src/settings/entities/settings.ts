import {IsNumber, IsString} from "class-validator";

/**
 * Глобальные настройки приложения.
 */

export class Settings {

    @IsString()
    public timezoneName = 'Europe/Moscow';

    @IsNumber()
    public refreshLength = 128; // Длинна рефреш-токена

    @IsNumber()
    public refreshExpiresAt = 2592000; // Через сколько истекает refresh (в секундах) (30 дней = 2592000 сек)

    @IsNumber()
    public expiresAt = 3600; // Через сколько истекает access (в секундах)
}

const settings = new Settings();

export default settings;
