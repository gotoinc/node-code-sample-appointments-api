import { Specialization } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';
import { CreateSpecializationDto } from './dto/create-specialization.dto';

export const SpecializationsServiceSymbol = Symbol('SPECIALIZATIONS_SERVICE');

export interface ISpecializationsService {
  findAll(): Promise<IServiceResponse<Specialization[]>>;
  findOne(id: number): Promise<IServiceResponse<Specialization>>;
  findByName(name: string): Promise<IServiceResponse<Specialization>>;
  create(
    specialization: CreateSpecializationDto,
  ): Promise<IServiceResponse<Specialization>>;
}
