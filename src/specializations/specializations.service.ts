import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { ISpecializationsService } from './specializations.service.interface';
import { Specialization } from '@prisma/client';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { ISpecializationsRepository } from './specializations.repository.interface';
import { SpecializationEntity } from './entities/specialization.entity';
import { ILogger } from 'src/common/interfaces/logger.interface';

export class SpecializationsService implements ISpecializationsService {
  constructor(
    private readonly logger: ILogger,
    private readonly specializationsRepository: ISpecializationsRepository,
  ) {}

  async findAll(): Promise<IServiceResponse<Specialization[]>> {
    try {
      const specializations: Specialization[] =
        await this.specializationsRepository.findAll();

      return ServiceResponse.success<Specialization[]>(specializations);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async findOne(id: number): Promise<IServiceResponse<Specialization | null>> {
    try {
      const specialization = await this.specializationsRepository.findOne(id);

      return ServiceResponse.success<Specialization | null>(specialization);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async findByName(
    name: string,
  ): Promise<IServiceResponse<Specialization | null>> {
    try {
      const specialization =
        await this.specializationsRepository.findByName(name);

      return ServiceResponse.success<Specialization | null>(specialization);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async create(
    specialization: CreateSpecializationDto,
  ): Promise<IServiceResponse<Specialization>> {
    try {
      const specializationEntity: SpecializationEntity = {
        name: specialization.name,
      };

      const createdSpecialization =
        await this.specializationsRepository.create(specializationEntity);

      return ServiceResponse.success<Specialization>(createdSpecialization);
    } catch (error) {
      this.logger.error(error);
      return {
        error: { message: 'Error creating specialization' },
        data: null,
      };
    }
  }
}
