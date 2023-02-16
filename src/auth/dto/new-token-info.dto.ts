import {DateTime} from 'luxon';
export interface NewTokenInfo {
    accessToken: string;
    //expiresAt: number;
    refreshToken: string;
    refreshExpiresAt: DateTime;
}