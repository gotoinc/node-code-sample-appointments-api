import { Injectable } from '@nestjs/common';
import { ISpecializationsRepository } from './specializations.repository.interface';
import { Specialization } from '@prisma/client';
import { SpecializationEntity } from './entities/specialization.entity';
import { PrismaService } from 'src/database/prisma.service';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';

@Injectable()
export class SpecializationsRepository
  extends PrismaBaseRepository
  implements ISpecializationsRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  async findAll(tx?: unknown): Promise<Specialization[]> {
    const prisma = this.getClient(tx);

    return await prisma.specialization.findMany();
  }

  async findOne(id: number, tx?: unknown): Promise<Specialization> {
    const prisma = this.getClient(tx);

    return await prisma.specialization.findUnique({
      where: {
        id,
      },
    });
  }

  async findByName(name: string, tx?: unknown): Promise<Specialization> {
    const prisma = this.getClient(tx);

    return await prisma.specialization.findUnique({
      where: {
        name,
      },
    });
  }

  async create(
    specialization: SpecializationEntity,
    tx?: unknown,
  ): Promise<Specialization> {
    const prisma = this.getClient(tx);

    return await prisma.specialization.create({
      data: {
        name: specialization.name,
      },
    });
  }
}
