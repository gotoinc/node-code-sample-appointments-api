import { Doctor } from '@prisma/client';
import { IServiceResponse } from 'src/common/interfaces/service-response.interface';
import { IDoctorsService } from './doctors.service.interface';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { IDoctorsRepository } from './doctors.repository.interface';
import { DoctorEntity } from './entities/doctor.entity';
import { ISpecializationsService } from 'src/specializations/specializations.service.interface';

export class DoctorsService implements IDoctorsService {
  constructor(
    private readonly doctorsRepository: IDoctorsRepository,
    private readonly specializationsService: ISpecializationsService,
  ) {}

  async create(
    doctor: CreateDoctorDto,
    userId: number,
  ): Promise<IServiceResponse<Doctor>> {
    try {
      const { error: errorSpecialization, data: specialization } =
        await this.specializationsService.findOne(doctor.specializationId);

      if (errorSpecialization)
        return { error: errorSpecialization, data: null };

      if (!specialization)
        return { error: { message: 'Specialization not found' }, data: null };

      const exisingDoctor = await this.doctorsRepository.findByUserId(userId);

      if (exisingDoctor)
        return {
          error: { message: 'Doctor profile already exists for this user' },
          data: null,
        };

      const doctorEntity: DoctorEntity = {
        phoneNumber: doctor.phone_number,
        licenceNumber: doctor.licence_number,
        specializationId: specialization.id,
      };

      const createdDoctor = await this.doctorsRepository.create(
        doctorEntity,
        userId,
      );

      return { error: null, data: createdDoctor };
    } catch (error) {
      console.error(error);

      return { error: { message: 'Error creating doctor' }, data: null };
    }
  }

  async findAll(): Promise<IServiceResponse<Doctor[]>> {
    try {
      const doctors = await this.doctorsRepository.findAll();

      return { error: null, data: doctors };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding all doctors' }, data: null };
    }
  }

  async findOne(id: number): Promise<IServiceResponse<Doctor>> {
    try {
      const doctor = await this.doctorsRepository.findOne(id);

      return { error: null, data: doctor };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding doctor' }, data: null };
    }
  }

  async findByUserId(userId: number): Promise<IServiceResponse<Doctor>> {
    try {
      const doctor = await this.doctorsRepository.findByUserId(userId);

      return { error: null, data: doctor };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding doctor' }, data: null };
    }
  }

  async update(
    id: number,
    doctor: UpdateDoctorDto,
  ): Promise<IServiceResponse<Doctor>> {
    try {
      const { error: errorSpecialization, data: specialization } =
        await this.specializationsService.findOne(doctor.specializationId);

      if (errorSpecialization || !specialization)
        return { error: errorSpecialization, data: null };

      const doctorEntity: DoctorEntity = {
        phoneNumber: doctor.phone_number,
        licenceNumber: doctor.licence_number,
        specializationId: specialization.id,
      };

      const updatedDoctor = await this.doctorsRepository.update(
        id,
        doctorEntity,
      );

      return { error: null, data: updatedDoctor };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error updating doctor' }, data: null };
    }
  }
}
