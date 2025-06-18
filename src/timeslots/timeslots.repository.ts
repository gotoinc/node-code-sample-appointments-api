import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { ITimeslotsRepository } from './timeslots.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { Timeslot } from '@prisma/client';
import { TimeslotEntity } from './entities/timeslot.entity';
import { FromToEntity } from './entities/from-to.entity';

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
        doctor_id: timeslot.doctorId,
      },
    });
  }

  async findManyByDoctorId(
    doctorId: number,
    { from, to }: FromToEntity,
    tx?: unknown,
  ): Promise<Timeslot[]> {
    const prisma = this.getClient(tx);

    return await prisma.timeslot.findMany({
      where: {
        doctor_id: doctorId,
        start_time: { gte: from },
        end_time: { lte: to },
      },
    });
  }

  async findCollisions(
    startTime: Date,
    endTime: Date,
    tx?: unknown,
  ): Promise<Timeslot[]> {
    const prisma = this.getClient(tx);

    return await prisma.timeslot.findMany({
      where: {
        AND: [
          {
            start_time: {
              lt: endTime,
            },
          },
          {
            end_time: {
              gt: startTime,
            },
          },
        ],
      },
    });
  }

  async findById(id: number, tx?: unknown): Promise<Timeslot | null> {
    const prisma = this.getClient(tx);

    return await prisma.timeslot.findUnique({
      where: {
        id,
      },
    });
  }

  async setUnavailable(id: number, tx?: unknown): Promise<Timeslot> {
    const prisma = this.getClient(tx);

    return await prisma.timeslot.update({
      where: {
        id,
      },
      data: {
        is_available: false,
      },
    });
  }
  async createMany(
    timeslots: TimeslotEntity[],
    tx?: unknown,
  ): Promise<{ count: number }> {
    const prisma = this.getClient(tx);

    return await prisma.timeslot.createMany({
      data: timeslots.map((ts) => ({
        start_time: ts.startTime,
        end_time: ts.endTime,
        doctor_id: ts.doctorId,
      })),
      skipDuplicates: true,
    });
  }
}
