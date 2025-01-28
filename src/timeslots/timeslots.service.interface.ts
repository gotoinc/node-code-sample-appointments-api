import { Timeslot } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { FromToQueryDto } from './dto/from-to-query.dto';

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
}
