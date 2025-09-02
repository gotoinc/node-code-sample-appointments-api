import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class DeleteTimeslotDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}
