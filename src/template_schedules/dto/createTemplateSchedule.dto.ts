import {
  IsInt,
  IsString,
  IsObject,
  Validate,
  IsMilitaryTime,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

class DayScheduleDto {
  @IsString()
  @IsMilitaryTime()
  start_time: string;

  @IsString()
  @IsMilitaryTime()
  end_time: string;
}

@ValidatorConstraint({ name: 'IsScheduleObject', async: false })
class IsScheduleObjectConstraint implements ValidatorConstraintInterface {
  validate(schedule: any) {
    if (typeof schedule !== 'object' || schedule === null) return false;
    const days: DayOfWeek[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    for (const key of Object.keys(schedule)) {
      if (!days.includes(key as DayOfWeek)) return false;
      const value = schedule[key];
      if (
        typeof value !== 'object' ||
        typeof value.start_time !== 'string' ||
        typeof value.end_time !== 'string'
      ) {
        return false;
      }
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (
        !timeRegex.test(value.start_time) ||
        !timeRegex.test(value.end_time)
      ) {
        return false;
      }
    }
    return true;
  }
  defaultMessage() {
    return 'schedule must be an object with days of week as keys and valid {start_time, end_time} in HH:MM format as values';
  }
}

export class CreateTemplateScheduleDto {
  @IsString()
  name: string;

  @IsInt()
  slotDuration: number;

  @IsObject()
  @Validate(IsScheduleObjectConstraint)
  schedule: Partial<Record<DayOfWeek, DayScheduleDto>>;
}
