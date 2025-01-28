import { IsDateString } from 'class-validator';

export class CreateTimeslotDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
