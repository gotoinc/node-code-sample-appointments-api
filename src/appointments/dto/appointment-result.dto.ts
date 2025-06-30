import { AppointmentDto } from './appointment.dto';

export class AppointmentResultDto {
  id: number;
  diagnosis: string;
  recommendations: string;
  appointment_id: number;
  appointment: AppointmentDto;
}
