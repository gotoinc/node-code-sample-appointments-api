import { CreateTemplateScheduleSchema } from '../dto/createTemplateSchedule.dto';
import z from 'zod';

export type Schedule = z.infer<typeof CreateTemplateScheduleSchema>['schedule'];
export class TemplateScheduleEntity {
  name: string;
  slotDuration: number;
  schedule: Schedule;
  doctor_id: number;
}
