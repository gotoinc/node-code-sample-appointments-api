export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type ISchedule = {
  [day in DayOfWeek]?: {
    start_time: string;
    end_time: string;
  };
};

export class TemplateScheduleEntity {
  name: string;
  slotDuration: number;
  schedule: ISchedule;
  doctor_id: number;
}
