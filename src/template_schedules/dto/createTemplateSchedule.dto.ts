import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const dayOfWeek = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);
export type DayOfWeek = z.infer<typeof dayOfWeek>;

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const DayScheduleSchema = z.object({
  start_time: z
    .string()
    .regex(timeRegex, { message: 'Invalid time format (HH:MM)' }),
  end_time: z
    .string()
    .regex(timeRegex, { message: 'Invalid time format (HH:MM)' }),
});

export const CreateTemplateScheduleSchema = z.object({
  name: z.string(),
  slotDuration: z.number().int(),
  schedule: z.record(dayOfWeek, DayScheduleSchema.partial()),
});

export class CreateTemplateScheduleDto extends createZodDto(
  CreateTemplateScheduleSchema,
) {}
