import { IsDateString } from 'class-validator';

export class CreateTimeslotDto {
  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;
}
