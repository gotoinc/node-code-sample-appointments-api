import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { IAppointmentsRepository } from './appointments.repository.interface';
import { Appointment } from '@prisma/client';
import { AppointmentEntity } from './entities/appointment.entity';
import { PrismaService } from 'src/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentsRepository
  extends PrismaBaseRepository
  implements IAppointmentsRepository
{
  constructor(prismaClient: PrismaService) {
    super(prismaClient);
  }

  async findById(id: number, tx?: unknown): Promise<Appointment | null> {
    const prisma = this.getClient(tx);

    return await prisma.appointment.findUnique({
      where: {
        id,
      },
      include: {
        doctor: true,
        patient: true,
        timeslot: true,
      },
    });
  }

  async findByDoctorId(doctorId: number, tx?: unknown): Promise<Appointment[]> {
    const prisma = this.getClient(tx);

    return await prisma.appointment.findMany({
      where: {
        doctor_id: doctorId,
      },
      include: {
        doctor: true,
        patient: true,
        timeslot: true,
      },
    });
  }

  async findByPatientId(
    patientId: number,
    tx?: unknown,
  ): Promise<Appointment[]> {
    const prisma = this.getClient(tx);

    return await prisma.appointment.findMany({
      where: {
        patient_id: patientId,
      },
      include: {
        doctor: true,
        patient: true,
        timeslot: true,
      },
    });
  }

  async create(
    appointment: AppointmentEntity,
    tx?: unknown,
  ): Promise<Appointment> {
    const prisma = this.getClient(tx);

    return await prisma.appointment.create({
      data: {
        full_name: appointment.fullName,
        email: appointment.email,
        phone_number: appointment.phoneNumber,
        patient_insurance_number: appointment.patientInsuranceNumber,
        reason: appointment.reason,
        timeslot_id: appointment.timeslotId,
        doctor_id: appointment.doctorId,
        patient_id: appointment.patientId,
      },
    });
  }
}
