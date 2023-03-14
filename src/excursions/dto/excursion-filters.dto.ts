import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional} from "class-validator";

export class ExcursionFiltersDto {

    @ApiPropertyOptional({
        description: 'Название экскурсии. Поиск по ILIKE %q%',
    })
    @IsOptional()
    public readonly q?: string;
}