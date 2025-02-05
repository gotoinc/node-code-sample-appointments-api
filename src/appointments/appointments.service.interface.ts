import { Appointment } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

export const AppointmentsServiceSymbol = Symbol('APPOINTMENTS_SERVICE');

export interface IAppointmentsService {
  findById(id: number): Promise<IServiceResponse<Appointment>>;
  findByDoctorId(doctorId: number): Promise<IServiceResponse<Appointment[]>>;
  findByPatientId(patientId: number): Promise<IServiceResponse<Appointment[]>>;
  create(
    appointment: CreateAppointmentDto,
    userId: number,
  ): Promise<IServiceResponse<Appointment>>;
}
