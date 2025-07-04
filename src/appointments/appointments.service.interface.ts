import { IServiceResponse } from 'src/common/service-response';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';

export const AppointmentsServiceSymbol = Symbol('APPOINTMENTS_SERVICE');

export interface IAppointmentsService {
  findById(id: number): Promise<IServiceResponse<AppointmentDto>>;
  findByDoctorId(doctorId: number): Promise<IServiceResponse<AppointmentDto[]>>;
  findByPatientId(
    patientId: number,
  ): Promise<IServiceResponse<AppointmentDto[]>>;
  create(
    appointment: CreateAppointmentDto,
    userId: number,
  ): Promise<IServiceResponse<AppointmentDto>>;
  declineAppointment(
    appointmentId: number,
    userId: number,
  ): Promise<IServiceResponse<AppointmentDto>>;
}
