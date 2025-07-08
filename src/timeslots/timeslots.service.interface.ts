import { Timeslot } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { FromToQueryDto } from './dto/from-to-query.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';

export const TimeslotsServiceSymbol = Symbol('TIMESLOTS_SERVICE');

export interface ITimeslotsService {
  create(
    timeslotDto: CreateTimeslotDto,
    userId: number,
  ): Promise<IServiceResponse<Timeslot>>;
  findByDoctorId(
    doctorId: number,
    fromTo: FromToQueryDto,
  ): Promise<IServiceResponse<Timeslot[]>>;
  findById(id: number): Promise<IServiceResponse<Timeslot>>;
  createSchedule(
    createScheduleDto: CreateScheduleDto,
    doctorId: number,
  ): Promise<IServiceResponse<{ status: string }>>;
}
