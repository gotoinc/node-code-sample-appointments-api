import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { ITimeslotsService } from './timeslots.service.interface';
import { ITimeslotsRepository } from './timeslots.repository.interface';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { TimeslotEntity } from './entities/timeslot.entity';
import { IDoctorsService } from 'src/doctors/doctors.service.interface';
import { FromToQueryDto } from './dto/from-to-query.dto';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { TimeslotDto } from './dto/timeslot.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';

export class TimeslotsService implements ITimeslotsService {
  constructor(
    private readonly logger: ILogger,
    private readonly timeslotsRepository: ITimeslotsRepository,
    private readonly doctorsService: IDoctorsService,
  ) {}

  private hasLocalCollisions(timeslots: CreateTimeslotDto[]): boolean {
    const sorted = timeslots
      .slice()
      .sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      );

    for (let i = 1; i < sorted.length; i++) {
      const currentStart = new Date(sorted[i].start_time).getTime();
      const previousEnd = new Date(sorted[i - 1].end_time).getTime();

      if (currentStart < previousEnd) {
        return true;
      }
    }

    return false;
  }

  async create(
    timeslotDto: CreateTimeslotDto,
    userId: number,
  ): Promise<IServiceResponse<TimeslotDto>> {
    try {
      const { error: errorDoctor, data: doctor } =
        await this.doctorsService.findByUserId(userId);

      if (errorDoctor) return { error: errorDoctor, data: null };
      if (!doctor) return ServiceResponse.notFound('Doctor not found');

      const doctorId = doctor.id;

      const timeslotEntity: TimeslotEntity = {
        startTime: new Date(timeslotDto.start_time),
        endTime: new Date(timeslotDto.end_time),
        doctorId,
      };

      const collisions = await this.timeslotsRepository.findCollisions(
        timeslotEntity.startTime,
        timeslotEntity.endTime,
      );

      if (collisions.length > 0)
        return ServiceResponse.conflict('Timeslots collision');

      const timeslot = await this.timeslotsRepository.create(timeslotEntity);

      return ServiceResponse.success<TimeslotDto>(timeslot);
    } catch (error) {
      this.logger.error(error);
      return {
        error: { message: 'Error creating doctor timeslots' },
        data: null,
      };
    }
  }

  async findByDoctorId(
    doctorId: number,
    { from, to }: FromToQueryDto,
  ): Promise<IServiceResponse<TimeslotDto[]>> {
    try {
      const fromToEntity = {
        from: new Date(from),
        to: new Date(to),
      };

      const timeslots = await this.timeslotsRepository.findManyByDoctorId(
        doctorId,
        fromToEntity,
      );

      return ServiceResponse.success<TimeslotDto[]>(timeslots);
    } catch (error) {
      this.logger.error(error);
      return {
        error: { message: 'Error finding doctor timeslots' },
        data: null,
      };
    }
  }

  async findById(id: number): Promise<IServiceResponse<TimeslotDto>> {
    try {
      const timeslot = await this.timeslotsRepository.findById(id);

      if (!timeslot) return ServiceResponse.notFound('Timeslot not found');

      return ServiceResponse.success<TimeslotDto>(timeslot);
    } catch (error) {
      this.logger.error(error);
      return {
        error: { message: 'Error finding timeslot' },
        data: null,
      };
    }
  }

  async createSchedule(
    timeslotsDto: CreateScheduleDto,
    userId: number,
  ): Promise<IServiceResponse<{ status: string }>> {
    try {
      const { error: errorDoctor, data: doctor } =
        await this.doctorsService.findByUserId(userId);
      if (errorDoctor) return { error: errorDoctor, data: null };
      if (!doctor) return ServiceResponse.notFound('Doctor not found');

      const doctorId = doctor.id;

      const hasCollisions = this.hasLocalCollisions(timeslotsDto.timeslots);

      if (hasCollisions) {
        return ServiceResponse.conflict(`Timeslot collisions`);
      }

      const timeslotEntities: TimeslotEntity[] = timeslotsDto.timeslots.map(
        (dto) => ({
          startTime: new Date(dto.start_time),
          endTime: new Date(dto.end_time),
          doctorId,
        }),
      );

      for (const entity of timeslotEntities) {
        const collisions = await this.timeslotsRepository.findCollisions(
          entity.startTime,
          entity.endTime,
        );
        if (collisions.length > 0) {
          return ServiceResponse.conflict(
            `Timeslot collision for ${entity.startTime.toISOString()}`,
          );
        }
      }

      await this.timeslotsRepository.createMany(timeslotEntities);

      return ServiceResponse.success<{ status: string }>({ status: 'ok' });
    } catch (error) {
      this.logger.error(error);
      return {
        error: { message: 'Error creating doctor schedule' },
        data: null,
      };
    }
  }
}
