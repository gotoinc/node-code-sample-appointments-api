import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateTimeslotDto } from './create-timeslot.dto';

export class CreateScheduleDto {
  @Type(() => CreateTimeslotDto)
  @ValidateNested({ each: true })
  timeslots: CreateTimeslotDto[];
}
