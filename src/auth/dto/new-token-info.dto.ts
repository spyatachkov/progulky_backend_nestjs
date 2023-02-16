import {DateTime} from 'luxon';
export class NewTokenInfo {
    accessToken: string;
    //expiresAt: number;
    refreshToken: string;
    refreshExpiresAt: DateTime;
}