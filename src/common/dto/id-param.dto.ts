import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class IdParamDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1, { message: 'ID must be a positive integer or string' })
  id: number;
}
