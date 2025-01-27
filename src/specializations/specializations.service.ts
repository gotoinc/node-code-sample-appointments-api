import { IServiceResponse } from 'src/common/service-response';
import { ISpecializationsService } from './specializations.service.interface';
import { Specialization } from '@prisma/client';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { ISpecializationsRepository } from './specializations.repository.interface';
import { SpecializationEntity } from './entities/specialization.entity';

export class SpecializationsService implements ISpecializationsService {
  constructor(
    private readonly specializationsRepository: ISpecializationsRepository,
  ) {}

  async findAll(): Promise<IServiceResponse<Specialization[]>> {
    try {
      const specializations: Specialization[] =
        await this.specializationsRepository.findAll();
      return { error: null, data: specializations };
    } catch (error) {
      console.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async findOne(id: number): Promise<IServiceResponse<Specialization>> {
    try {
      const specialization = await this.specializationsRepository.findOne(id);
      return { error: null, data: specialization };
    } catch (error) {
      console.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async findByName(name: string): Promise<IServiceResponse<Specialization>> {
    try {
      const specialization =
        await this.specializationsRepository.findByName(name);
      return { error: null, data: specialization };
    } catch (error) {
      console.error(error);
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

      return { error: null, data: createdSpecialization };
    } catch (error) {
      console.error(error);
      return {
        error: { message: 'Error creating specialization' },
        data: null,
      };
    }
  }
}
