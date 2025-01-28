import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FromToQueryDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  from: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  to: number;
}
