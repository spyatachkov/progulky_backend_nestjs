import {Injectable, ValidationPipe} from '@nestjs/common';
import {ValidationPipeOptions} from '@nestjs/common/pipes/validation.pipe';

@Injectable()
export class StrictValidationPipe extends ValidationPipe {
  public constructor(options: ValidationPipeOptions) {
    const pipeOptions = {
      enableDebugMessages: false,
      whitelist: true,
      disableErrorMessages: false,
      stopAtFirstError: false,
    };
    options = Object.assign(options ?? {}, pipeOptions);
    super(options);
  }
}
