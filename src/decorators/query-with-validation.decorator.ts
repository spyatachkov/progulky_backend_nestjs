import {Query, Type, ValidationPipe} from '@nestjs/common';

import {NonStrictValidationPipe, StrictValidationPipe} from '../pipes';

//eslint-disable-next-line
//eslint-disable-next-line
export const QueryWithValidation = (pipe: Type<ValidationPipe> | ValidationPipe = StrictValidationPipe): ParameterDecorator => Query(pipe);

//eslint-disable-next-line
export const QueryWithValidationNonStrict = (): ParameterDecorator => Query(NonStrictValidationPipe);
