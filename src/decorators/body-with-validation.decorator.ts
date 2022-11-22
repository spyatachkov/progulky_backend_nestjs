import {Body, Type, ValidationPipe} from '@nestjs/common';

import {NonStrictValidationPipe, StrictValidationPipe} from '../pipes';


//eslint-disable-next-line
export const BodyWithValidation = (pipe: Type<ValidationPipe> | ValidationPipe = StrictValidationPipe): ParameterDecorator => Body(pipe);

//eslint-disable-next-line
export const BodyWithValidationNonStrict = (): ParameterDecorator => Body(NonStrictValidationPipe);
