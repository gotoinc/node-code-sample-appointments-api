import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import {
  DoctorReturnType,
  IDoctorsRepository,
} from './doctors.repository.interface';
import { DoctorEntity } from './entities/doctor.entity';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DoctorsRepository
  extends PrismaBaseRepository
  implements IDoctorsRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  create(
    doctor: DoctorEntity,
    userId: number,
    tx?: unknown,
  ): Promise<DoctorReturnType> {
    const prisma = this.getClient(tx);

    return prisma.doctor.create({
      data: {
        phone_number: doctor.phoneNumber,
        licence_number: doctor.licenceNumber,
        specialization_id: doctor.specializationId,
        user_id: userId,
        hospital_address: doctor.hospital_address,
        hospital_name: doctor.hospital_name,
        professional_since: doctor.professional_since,
      },
      include: { user: true, specialization: true },
    });
  }

  async findAll(tx?: unknown): Promise<DoctorReturnType[]> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.findMany({
      include: { user: true, specialization: true },
    });
  }

  async findOne(id: number, tx?: unknown): Promise<DoctorReturnType | null> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.findUnique({
      where: { id },
      include: { user: true, specialization: true },
    });
  }

  async findByUserId(
    userId: number,
    tx?: unknown,
  ): Promise<DoctorReturnType | null> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.findUnique({
      where: {
        user_id: userId,
      },
      include: { user: true, specialization: true },
    });
  }

  async update(
    id: number,
    doctor: DoctorEntity,
    tx?: unknown,
  ): Promise<DoctorReturnType> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.update({
      where: {
        id,
      },
      data: {
        phone_number: doctor.phoneNumber,
        licence_number: doctor.licenceNumber,
        specialization_id: doctor.specializationId,
        hospital_address: doctor.hospital_address,
        hospital_name: doctor.hospital_name,
        professional_since: doctor.professional_since,
      },
      include: { user: true, specialization: true },
    });
  }
}
