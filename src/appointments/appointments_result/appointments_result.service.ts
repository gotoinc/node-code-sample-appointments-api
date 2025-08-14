import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { IAppointmentsResultService } from './appointments_result.service.interface';
import { AppointmentResultDto } from '../dto/appointment-result.dto';
import { AppointmentResultEntity } from '../entities/appointmentResult.entity';
import { AddAppointmentResultDto } from '../dto/add-appointment-result.dto';
import { IAppointmentsResultRepository } from './appointments_result.repository.interface';

export class AppointmentsResultService implements IAppointmentsResultService {
  constructor(
    private readonly logger: ILogger,
    private readonly appointmentsResultRepository: IAppointmentsResultRepository,
  ) {}

  async create(
    appointmentResult: AddAppointmentResultDto,
  ): Promise<IServiceResponse<AppointmentResultDto>> {
    try {
      const existedAppointmentResult =
        await this.appointmentsResultRepository.findByAppointmentId(
          appointmentResult.appointmentId,
        );

      if (existedAppointmentResult) {
        return ServiceResponse.conflict('Result already exist');
      }

      const appointmentResultEntity: AppointmentResultEntity = {
        appointmentId: appointmentResult.appointmentId,
        diagnosis: appointmentResult.diagnosis,
        recommendations: appointmentResult.recommendations,
      };

      const appointmentWithResult =
        await this.appointmentsResultRepository.create(appointmentResultEntity);

      return ServiceResponse.success<AppointmentResultDto>(
        appointmentWithResult,
      );
    } catch (error) {
      this.logger.error(error);
      return {
        error: { message: 'Error creating appointment result' },
        data: null,
      };
    }
  }
}
