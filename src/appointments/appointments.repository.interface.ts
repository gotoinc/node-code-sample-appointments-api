import { Appointment, Doctor, Patient, Prisma, Timeslot } from '@prisma/client';
import { AppointmentEntity } from './entities/appointment.entity';

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
  update(
    appointmentId: number,
    updatedData: Prisma.AppointmentUpdateInput,
    tx?: unknown,
  ): Promise<AppointmentReturnType>;
  countPatientsByDoctorId(
    doctorId: number,
    tx?: unknown,
  ): Promise<{ count: number }>;
  countAppointmentsByDoctorId(
    doctorId: number,
    tx?: unknown,
  ): Promise<{ count: number }>;
}
