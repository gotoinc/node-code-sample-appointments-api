import { IServiceResponse } from 'src/common/service-response';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { AddAppointmentResultDto } from './dto/add-appointment-result.dto';
import { AppointmentResultDto } from './dto/appointment-result.dto';

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
  addResult(
    appointmentResult: AddAppointmentResultDto,
  ): Promise<IServiceResponse<AppointmentResultDto>>;
  declineAppointment(
    appointmentId: number,
    userId: number,
  ): Promise<IServiceResponse<AppointmentDto>>;
}
