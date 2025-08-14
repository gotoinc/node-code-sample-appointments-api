import { TemplateSchedule } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';
import { CreateTemplateScheduleDto } from './dto/createTemplateSchedule.dto';

export const TemplateScheduleServiceSymbol = Symbol(
  'TEMPLATE_SCHEDULE_SERVICE',
);

export interface ITemplateScheduleService {
  create(
    templateDto: CreateTemplateScheduleDto,
    userId: number,
  ): Promise<IServiceResponse<TemplateSchedule>>;
  findByDoctorId(
    doctorId: number,
  ): Promise<IServiceResponse<TemplateSchedule[]>>;
  findById(id: number): Promise<IServiceResponse<TemplateSchedule | null>>;
}
