import { Timeslot } from '@prisma/client';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { ITimeslotsService } from './timeslots.service.interface';
import { ITimeslotsRepository } from './timeslots.repository.interface';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { TimeslotEntity } from './entities/timeslot.entity';
import { IDoctorsService } from 'src/doctors/doctors.service.interface';

export class TimeslotsService implements ITimeslotsService {
  constructor(
    private readonly timeslotsRepository: ITimeslotsRepository,
    private readonly doctorsService: IDoctorsService,
  ) {}
  async create(
    timeslotDto: CreateTimeslotDto,
    userId: number,
  ): Promise<IServiceResponse<Timeslot>> {
    try {
      const { error: errorDoctor, data: doctor } =
        await this.doctorsService.findByUserId(userId);
      if (errorDoctor || !doctor) return { error: errorDoctor, data: null };

      const doctorId = doctor.id;

      const timeslotEntity: TimeslotEntity = {
        startTime: new Date(timeslotDto.startTime),
        endTime: new Date(timeslotDto.endTime),
        doctorId,
      };

      const timeslot = await this.timeslotsRepository.create(timeslotEntity);

      return ServiceResponse.success<Timeslot>(timeslot);
    } catch (error) {
      console.error(error);
      return {
        error: { message: 'Error creating doctor timeslots' },
        data: null,
      };
    }
  }

  async findByDoctorId(
    doctorId: number,
  ): Promise<IServiceResponse<Timeslot[]>> {
    try {
      const timeslots =
        await this.timeslotsRepository.findManyByDoctorId(doctorId);

      return ServiceResponse.success<Timeslot[]>(timeslots);
    } catch (error) {
      console.error(error);
      return {
        error: { message: 'Error finding doctor timeslots' },
        data: null,
      };
    }
  }
}
