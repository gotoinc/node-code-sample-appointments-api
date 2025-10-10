import { PartialType } from '@nestjs/swagger';
import { AddAppointmentResultDto } from './add-appointment-result.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAppointmentResultDto extends PartialType(
  AddAppointmentResultDto,
) {
  @IsNotEmpty()
  @IsNumber()
  appointmentId: number;
}
