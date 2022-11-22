import {Injectable, ValidationPipe} from '@nestjs/common';
import {ValidationPipeOptions} from '@nestjs/common/pipes/validation.pipe';

@Injectable()
export class NonStrictValidationPipe extends ValidationPipe {
  public constructor(options: ValidationPipeOptions) {
    const pipeOptions = {
      enableDebugMessages: true,
      whitelist: true,
      disableErrorMessages: false,
      stopAtFirstError: false,
    };
    options = Object.assign(options ?? {}, pipeOptions);
    super(options);
  }
}
