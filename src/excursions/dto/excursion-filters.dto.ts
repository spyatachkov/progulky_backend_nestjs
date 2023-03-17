import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsNumberString, IsOptional, IsString} from "class-validator";

export class ExcursionFiltersDto {

    @ApiPropertyOptional({
        description: 'Название экскурсии. Поиск по ILIKE %q%',
    })
    @IsOptional()
    public readonly q?: string;

    @ApiPropertyOptional({
        description: 'Город экскурсии',
    })
    @IsOptional()
    public readonly city?: string;

    @ApiPropertyOptional({
        description: 'Левая граница длины маршрута',
    })
    @IsOptional()
    @IsNumberString()
    public readonly l_f_p?: string; // length first parameter

    @ApiPropertyOptional({
        description: 'Правая граница длины маршрута',
    })
    @IsOptional()
    @IsNumberString()
    public readonly l_s_p?: string; // length second parameter

    @ApiPropertyOptional({
        description: 'Левая граница длительности маршрута',
    })
    @IsOptional()
    @IsNumberString()
    public readonly t_f_p?: string; // time first parameter

    @ApiPropertyOptional({
        description: 'Правая граница длительности маршрута',
    })
    @IsOptional()
    @IsNumberString()
    public readonly t_s_p?: string; // time second parameter

    @ApiPropertyOptional({
        description: 'Рейтинг | all - null-5.0 | high - 5.0-4.5 | middle - 4.5-4.0 | low - 4.0-3.5',
    })
    @IsOptional()
    @IsString()
    public readonly rating?: string;
}
