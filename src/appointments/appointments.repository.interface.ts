import { Appointment, Doctor, Patient, Timeslot } from '@prisma/client';
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
  decline(
    appointmentId: number,
    declinedBy: 'declined_by_doctor' | 'declined_by_patient',
    tx?: unknown,
  ): Promise<AppointmentReturnType>;
}
