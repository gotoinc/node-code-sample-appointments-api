import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { PrismaService } from 'src/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { AppointmentResult } from '@prisma/client';
import { IAppointmentsResultRepository } from './appointments_result.repository.interface';
import { AppointmentResultEntity } from '../entities/appointmentResult.entity';
import { AppointmentReturnType } from '../appointments.repository.interface';

@Injectable()
export class AppointmentsResultRepository
  extends PrismaBaseRepository
  implements IAppointmentsResultRepository
{
  constructor(prismaClient: PrismaService) {
    super(prismaClient);
  }

  async create(
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

  async findByAppointmentId(
    appointmentId: number,
    tx?: unknown,
  ): Promise<
    (AppointmentResult & { appointment: AppointmentReturnType }) | null
  > {
    const prisma = this.getClient(tx);
    return await prisma.appointmentResult.findUnique({
      where: {
        appointment_id: appointmentId,
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
}
