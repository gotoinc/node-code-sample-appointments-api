import { TemplateSchedule } from '@prisma/client';
import { TemplateScheduleEntity } from './entities/template_schedule.entity';

export interface ITemplateScheduleRepository {
  create(
    template: TemplateScheduleEntity,
    tx?: unknown,
  ): Promise<TemplateSchedule>;
  findAllByDoctorId(
    doctorId: number,
    tx?: unknown,
  ): Promise<TemplateSchedule[]>;
  findById(id: number, tx?: unknown): Promise<TemplateSchedule | null>;
  findByName(
    name: string,
    doctorId: number,
    tx?: unknown,
  ): Promise<TemplateSchedule | null>;
}
