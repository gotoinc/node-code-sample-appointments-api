import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { IDoctorsRepository } from './doctors.repository.interface';
import { Doctor } from '@prisma/client';
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

  create(doctor: DoctorEntity, userId: number, tx?: unknown): Promise<Doctor> {
    const prisma = this.getClient(tx);

    return prisma.doctor.create({
      data: {
        phone_number: doctor.phoneNumber,
        licence_number: doctor.licenceNumber,
        fk_specialization_id: doctor.specializationId,
        fk_user_id: userId,
      },
    });
  }

  async findAll(tx?: unknown): Promise<Doctor[]> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.findMany();
  }

  async findOne(id: number, tx?: unknown): Promise<Doctor | null> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.findUnique({ where: { id } });
  }

  async findByUserId(userId: number, tx?: unknown): Promise<Doctor | null> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.findUnique({
      where: {
        fk_user_id: userId,
      },
    });
  }

  async update(
    id: number,
    doctor: DoctorEntity,
    tx?: unknown,
  ): Promise<Doctor> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.update({
      where: {
        id,
      },
      data: {
        phone_number: doctor.phoneNumber,
        licence_number: doctor.licenceNumber,
        fk_specialization_id: doctor.specializationId,
      },
    });
  }
}
