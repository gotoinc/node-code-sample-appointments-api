import { Timeslot } from '@prisma/client';
import { TimeslotEntity } from './entities/timeslot.entity';

export interface ITimeslotsRepository {
  create(timeslot: TimeslotEntity, tx?: unknown): Promise<Timeslot>;
  findManyByDoctorId(doctorId: number, tx?: unknown): Promise<Timeslot[]>;
}
