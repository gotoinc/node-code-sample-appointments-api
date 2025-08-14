import { AppointmentResult } from '@prisma/client';
import { AppointmentResultEntity } from '../entities/appointmentResult.entity';
import { AppointmentReturnType } from '../appointments.repository.interface';

export interface IAppointmentsResultRepository {
  create(
    appointmentResult: AppointmentResultEntity,
    tx?: unknown,
  ): Promise<AppointmentResult & { appointment: AppointmentReturnType }>;
  findByAppointmentId(
    appointmentId: number,
    tx?: unknown,
  ): Promise<
    (AppointmentResult & { appointment: AppointmentReturnType }) | null
  >;
}
