import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import {
  IPatientsRepository,
  PatientReturnType,
} from './patients.repository.interface';
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
  ): Promise<PatientReturnType> {
    const prisma = this.getClient(tx);

    return await prisma.patient.create({
      data: {
        date_of_birth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
        user_id: userId,
      },
      include: { user: true },
    });
  }

  async findAll(tx?: unknown): Promise<PatientReturnType[]> {
    const prisma = this.getClient(tx);

    return await prisma.patient.findMany({ include: { user: true } });
  }

  async findById(id: number, tx?: unknown): Promise<PatientReturnType | null> {
    const prisma = this.getClient(tx);

    return await prisma.patient.findUnique({
      where: {
        id,
      },
      include: { user: true },
    });
  }

  async findByUserId(
    userId: number,
    tx?: unknown,
  ): Promise<PatientReturnType | null> {
    const prisma = this.getClient(tx);

    return await prisma.patient.findUnique({
      where: {
        user_id: userId,
      },
      include: { user: true },
    });
  }

  async update(
    id: number,
    patient: PatientEntity,
    tx?: unknown,
  ): Promise<PatientReturnType> {
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
      include: { user: true },
    });
  }
}
