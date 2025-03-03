import { Doctor } from '@prisma/client';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IDoctorsService } from './doctors.service.interface';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { IDoctorsRepository } from './doctors.repository.interface';
import { DoctorEntity } from './entities/doctor.entity';
import { ISpecializationsService } from 'src/specializations/specializations.service.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { DoctorDto } from './dto/doctor.dto';

export class DoctorsService implements IDoctorsService {
  constructor(
    private readonly logger: ILogger,
    private readonly doctorsRepository: IDoctorsRepository,
    private readonly specializationsService: ISpecializationsService,
  ) {}

  async create(
    doctor: CreateDoctorDto,
    userId: number,
  ): Promise<IServiceResponse<DoctorDto>> {
    try {
      const { error: errorSpecialization, data: specialization } =
        await this.specializationsService.findOne(doctor.specializationId);

      if (errorSpecialization)
        return { error: errorSpecialization, data: null };

      if (!specialization)
        return ServiceResponse.invalidData('Specialization not found');

      const exisingDoctor = await this.doctorsRepository.findByUserId(userId);

      if (exisingDoctor)
        return ServiceResponse.conflict(
          'Doctor profile already exists for this user',
        );

      const doctorEntity: DoctorEntity = {
        phoneNumber: doctor.phone_number,
        licenceNumber: doctor.licence_number,
        specializationId: specialization.id,
      };

      const createdDoctor = await this.doctorsRepository.create(
        doctorEntity,
        userId,
      );

      return ServiceResponse.success(createdDoctor);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error creating doctor' }, data: null };
    }
  }

  async findAll(): Promise<IServiceResponse<DoctorDto[]>> {
    try {
      const doctors = await this.doctorsRepository.findAll();

      return ServiceResponse.success<Doctor[]>(doctors);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error finding all doctors' }, data: null };
    }
  }

  async findOne(id: number): Promise<IServiceResponse<DoctorDto | null>> {
    try {
      const doctor = await this.doctorsRepository.findOne(id);

      return ServiceResponse.success<Doctor | null>(doctor);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error finding doctor' }, data: null };
    }
  }

  async findByUserId(
    userId: number,
  ): Promise<IServiceResponse<DoctorDto | null>> {
    try {
      const doctor = await this.doctorsRepository.findByUserId(userId);

      return ServiceResponse.success<Doctor | null>(doctor);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error finding doctor' }, data: null };
    }
  }

  async update(
    doctorToUpdate: UpdateDoctorDto,
    userId: number,
  ): Promise<IServiceResponse<DoctorDto>> {
    try {
      const exisingDoctor = await this.doctorsRepository.findByUserId(userId);

      if (!exisingDoctor)
        return ServiceResponse.notFound('Doctor profile not found');

      if (userId !== exisingDoctor.user_id) return ServiceResponse.forbidden();

      const { error: errorSpecialization, data: specialization } =
        await this.specializationsService.findOne(
          doctorToUpdate.specializationId,
        );

      if (errorSpecialization)
        return { error: errorSpecialization, data: null };
      if (!specialization)
        return ServiceResponse.invalidData('Specialization not found');

      const doctorEntity: DoctorEntity = {
        phoneNumber: doctorToUpdate.phone_number,
        licenceNumber: doctorToUpdate.licence_number,
        specializationId: specialization.id,
      };

      const updatedDoctor = await this.doctorsRepository.update(
        exisingDoctor.id,
        doctorEntity,
      );

      return ServiceResponse.success<Doctor>(updatedDoctor);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error updating doctor' }, data: null };
    }
  }
}
