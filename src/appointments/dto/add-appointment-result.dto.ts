import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddAppointmentResultDto {
  @IsNumber()
  appointmentId: number;

  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @IsString()
  @IsNotEmpty()
  recommendations: string;
}
