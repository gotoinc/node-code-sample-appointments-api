import {
  Appointment,
  AppointmentResult,
  Doctor,
  Patient,
  Timeslot,
} from '@prisma/client';
import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentResultEntity } from './entities/appointmentResult.entity';

export type AppointmentReturnType = Appointment & {
  patient: Patient;
  doctor: Doctor;
  timeslot: Timeslot;
};

export interface IAppointmentsRepository {
  findById(id: number, tx?: unknown): Promise<AppointmentReturnType | null>;
  findByDoctorId(
    doctorId: number,
    tx?: unknown,
  ): Promise<AppointmentReturnType[]>;
  findByPatientId(
    patientId: number,
    tx?: unknown,
  ): Promise<AppointmentReturnType[]>;
  create(
    appointment: AppointmentEntity,
    tx?: unknown,
  ): Promise<AppointmentReturnType>;
  addResult(
    appointmentResult: AppointmentResultEntity,
    tx?: unknown,
  ): Promise<AppointmentResult & { appointment: AppointmentReturnType }>;
}
