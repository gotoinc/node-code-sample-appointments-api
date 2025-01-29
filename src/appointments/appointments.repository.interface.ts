import { Appointment } from '@prisma/client';
import { AppointmentEntity } from './entities/appointment.entity';

export interface IAppointmentsRepository {
  findById(id: number, tx?: unknown): Promise<Appointment | null>;
  findByDoctorId(doctorId: number, tx?: unknown): Promise<Appointment[]>;
  findByPatientId(patientId: number, tx?: unknown): Promise<Appointment[]>;
  create(appointment: AppointmentEntity, tx?: unknown): Promise<Appointment>;
}
