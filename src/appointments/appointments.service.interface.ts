import { Appointment } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

export const AppointmentsServiceSymbol = Symbol('APPOINTMENTS_SERVICE');

export interface IAppointmentsService {
  getById(id: number): Promise<IServiceResponse<Appointment>>;
  getByDoctorId(doctorId: number): Promise<IServiceResponse<Appointment[]>>;
  getByPatientId(patientId: number): Promise<IServiceResponse<Appointment[]>>;
  create(
    appointment: CreateAppointmentDto,
    userId: number,
  ): Promise<IServiceResponse<Appointment>>;
}
