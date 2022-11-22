import {Param, ParseIntPipe} from '@nestjs/common';
import {MaxValuePipe} from "../pipes";

/**
 * Чтобы брать id из query.
 * @param queryParamName
 */
export function IdParam(queryParamName = 'id'): ParameterDecorator {
  return Param(queryParamName, ParseIntPipe, MaxValuePipe);
}
