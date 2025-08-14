import { IsInt, Min } from 'class-validator';

export class DeclineAppointmentDto {
  @IsInt()
  @Min(1, { message: 'Appointment ID must be a positive integer or string' })
  appointmentId: number;
}
