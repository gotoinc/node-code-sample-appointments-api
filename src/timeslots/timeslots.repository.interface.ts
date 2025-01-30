import { Timeslot } from '@prisma/client';
import { TimeslotEntity } from './entities/timeslot.entity';
import { FromToEntity } from './entities/from-to.entity';

export interface ITimeslotsRepository {
  create(timeslot: TimeslotEntity, tx?: unknown): Promise<Timeslot>;
  findManyByDoctorId(
    doctorId: number,
    fromTo: FromToEntity,
    tx?: unknown,
  ): Promise<Timeslot[]>;
  findCollisions(
    startTime: Date,
    endTime: Date,
    tx?: unknown,
  ): Promise<Timeslot[]>;
  findById(id: number, tx?: unknown): Promise<Timeslot | null>;
  setUnavailable(id: number, tx?: unknown): Promise<Timeslot>;
}
