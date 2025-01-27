import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { IPatientsRepository } from './patients.repository.interface';
import { Patient } from '@prisma/client';
import { PatientEntity } from './entities/patient.entity';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PatientsRepository
  extends PrismaBaseRepository
  implements IPatientsRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  async create(
    patient: PatientEntity,
    userId: number,
    tx?: unknown,
  ): Promise<Patient> {
    const prisma = this.getClient(tx);

    return await prisma.patient.create({
      data: {
        date_of_birth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
        fk_user_id: userId,
      },
    });
  }

  async findAll(tx?: unknown): Promise<Patient[]> {
    const prisma = this.getClient(tx);

    return await prisma.patient.findMany();
  }

  async findById(id: number, tx?: unknown): Promise<Patient | null> {
    const prisma = this.getClient(tx);

    return await prisma.patient.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUserId(userId: number, tx?: unknown): Promise<Patient | null> {
    const prisma = this.getClient(tx);

    return await prisma.patient.findUnique({
      where: {
        fk_user_id: userId,
      },
    });
  }

  async update(
    id: number,
    patient: PatientEntity,
    tx?: unknown,
  ): Promise<Patient> {
    const prisma = this.getClient(tx);

    return await prisma.patient.update({
      where: {
        id,
      },
      data: {
        date_of_birth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
      },
    });
  }
}
