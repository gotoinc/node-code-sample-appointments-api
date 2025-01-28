import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { ITimeslotsRepository } from './timeslots.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { Timeslot } from '@prisma/client';
import { TimeslotEntity } from './entities/timeslot.entity';

@Injectable()
export class TimeslotsRepository
  extends PrismaBaseRepository
  implements ITimeslotsRepository
{
  constructor(prismaClient: PrismaService) {
    super(prismaClient);
  }

  create(timeslot: TimeslotEntity, tx?: unknown): Promise<Timeslot> {
    const prisma = this.getClient(tx);

    return prisma.timeslot.create({
      data: {
        start_time: timeslot.startTime,
        end_time: timeslot.endTime,
        fk_doctor_id: timeslot.doctorId,
      },
    });
  }

  async findManyByDoctorId(
    doctorId: number,
    tx?: unknown,
  ): Promise<Timeslot[]> {
    const prisma = this.getClient(tx);

    return await prisma.timeslot.findMany({
      where: {
        fk_doctor_id: doctorId,
      },
    });
  }
}
