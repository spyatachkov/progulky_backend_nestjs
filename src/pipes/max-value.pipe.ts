import {BadRequestException, PipeTransform} from '@nestjs/common';

export class MaxValuePipe implements PipeTransform {

  public constructor(
    private readonly maxValue = 2147483647, // Максимальное значение Int в Postgres
  ) {
  }

  public transform(value: any): any {
    if (typeof value === 'number' && value > this.maxValue) {
      const message = `Value ${value} is bigger then ${this.maxValue}`;
      throw new BadRequestException("Bad Request");
    }

    return value;
  }
}
