import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { ITemplateScheduleService } from './template_schedules.service.interface';
import { ITemplateScheduleRepository } from './template_schedules.repository.interface';
import { TemplateSchedule } from '@prisma/client';
import { CreateTemplateScheduleDto } from './dto/createTemplateSchedule.dto';
import { IDoctorsService } from 'src/doctors/doctors.service.interface';
import { TemplateScheduleEntity } from './entities/template_schedule.entity';

export class TemplateScheduleService implements ITemplateScheduleService {
  constructor(
    private readonly logger: ILogger,
    private readonly templateRepository: ITemplateScheduleRepository,
    private readonly doctorsService: IDoctorsService,
  ) {}

  async create(
    templateDto: CreateTemplateScheduleDto,
    userId: number,
  ): Promise<IServiceResponse<TemplateSchedule>> {
    try {
      const { error: errorDoctor, data: doctor } =
        await this.doctorsService.findByUserId(userId);

      if (errorDoctor) return { error: errorDoctor, data: null };
      if (!doctor) return ServiceResponse.notFound('Doctor not found');

      const doctorId = doctor.id;

      const existedTemplate = await this.templateRepository.findByName(
        templateDto.name,
        doctorId,
      );

      if (existedTemplate)
        return ServiceResponse.conflict(
          'A template with this name already exists',
        );

      const templateScheduleEntity: TemplateScheduleEntity = {
        doctor_id: doctorId,
        name: templateDto.name,
        schedule: templateDto.schedule,
        slotDuration: templateDto.slotDuration,
      };

      const timeslot = await this.templateRepository.create(
        templateScheduleEntity,
      );

      return ServiceResponse.success<TemplateSchedule>(timeslot);
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
  ): Promise<IServiceResponse<TemplateSchedule[]>> {
    const template = await this.templateRepository.findAllByDoctorId(doctorId);

    return ServiceResponse.success(template);
  }

  async findById(
    id: number,
  ): Promise<IServiceResponse<TemplateSchedule | null>> {
    const template = await this.templateRepository.findById(id);

    return ServiceResponse.success(template);
  }
}
