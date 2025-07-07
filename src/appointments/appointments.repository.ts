import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import {
  AppointmentReturnType,
  IAppointmentsRepository,
} from './appointments.repository.interface';
import { AppointmentEntity } from './entities/appointment.entity';
import { PrismaService } from 'src/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { AppointmentResult } from '@prisma/client';
import { AppointmentResultEntity } from './entities/appointmentResult.entity';

@Injectable()
export class AppointmentsRepository
  extends PrismaBaseRepository
  implements IAppointmentsRepository
{
  constructor(prismaClient: PrismaService) {
    super(prismaClient);
  }

  async findById(
    id: number,
    tx?: unknown,
  ): Promise<AppointmentReturnType | null> {
    const prisma = this.getClient(tx);

    return await prisma.appointment.findUnique({
      where: {
        id,
      },
      include: {
        appointment_result: true,
        doctor: {
          include: {
            specialization: true,
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
        timeslot: true,
      },
    });
  }

  async findByDoctorId(
    doctorId: number,
    tx?: unknown,
  ): Promise<AppointmentReturnType[]> {
    const prisma = this.getClient(tx);

    return await prisma.appointment.findMany({
      where: {
        doctor_id: doctorId,
      },
      include: {
        appointment_result: true,
        doctor: {
          include: {
            specialization: true,
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
        timeslot: true,
      },
    });
  }

  async findByPatientId(
    patientId: number,
    tx?: unknown,
  ): Promise<AppointmentReturnType[]> {
    const prisma = this.getClient(tx);

    return await prisma.appointment.findMany({
      where: {
        patient_id: patientId,
      },
      include: {
        appointment_result: true,
        doctor: {
          include: {
            specialization: true,
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
        timeslot: true,
      },
    });
  }

  async create(
    appointment: AppointmentEntity,
    tx?: unknown,
  ): Promise<AppointmentReturnType> {
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
      include: {
        doctor: {
          include: {
            specialization: true,
            user: true,
          },
        },
        patient: {
          include: {
            user: true,
          },
        },
        timeslot: true,
      },
    });
  }

  async addResult(
    appointmentResult: AppointmentResultEntity,
    tx?: unknown,
  ): Promise<AppointmentResult & { appointment: AppointmentReturnType }> {
    const prisma = this.getClient(tx);
    return await prisma.appointmentResult.create({
      data: {
        diagnosis: appointmentResult.diagnosis,
        recommendations: appointmentResult.recommendations,
        appointment_id: appointmentResult.appointmentId,
      },
      include: {
        appointment: {
          include: {
            doctor: true,
            patient: true,
            timeslot: true,
          },
        },
      },
    });
  }

  async decline(
    appointmentId: number,
    declinedBy: 'declined_by_doctor' | 'declined_by_patient',
    tx?: unknown,
  ): Promise<AppointmentReturnType> {
    const prisma = this.getClient(tx);

    return prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        [declinedBy]: true,
      },
      include: {
        doctor: true,
        patient: true,
        timeslot: true,
      },
    });
  }
}
