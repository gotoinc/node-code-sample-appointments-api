import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { PrismaService } from 'src/database/prisma.service';
import { TemplateSchedule } from '@prisma/client';
import { ITemplateScheduleRepository } from './template_schedules.repository.interface';
import { TemplateScheduleEntity } from './entities/template_schedule.entity';

@Injectable()
export class TemplateScheduleRepository
  extends PrismaBaseRepository
  implements ITemplateScheduleRepository
{
  constructor(prismaClient: PrismaService) {
    super(prismaClient);
  }

  async create(
    template: TemplateScheduleEntity,
    tx?: unknown,
  ): Promise<TemplateSchedule> {
    const prisma = this.getClient(tx);

    return prisma.templateSchedule.create({
      data: {
        name: template.name,
        schedule: template.schedule,
        slotDuration: template.slotDuration,
        doctor_id: template.doctor_id,
      },
    });
  }

  async findAllByDoctorId(
    doctorId: number,
    tx?: unknown,
  ): Promise<TemplateSchedule[]> {
    const prisma = this.getClient(tx);

    return prisma.templateSchedule.findMany({
      where: {
        doctor_id: doctorId,
      },
    });
  }

  async findById(id: number, tx?: unknown): Promise<TemplateSchedule | null> {
    const prisma = this.getClient(tx);

    return prisma.templateSchedule.findUnique({
      where: {
        id,
      },
    });
  }
}
