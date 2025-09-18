import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import {
  DoctorReturnType,
  IDoctorsRepository,
} from './doctors.repository.interface';
import { DoctorEntity } from './entities/doctor.entity';
import { PrismaService } from 'src/database/prisma.service';
import { GetDoctorQuery } from './dto/doctor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DoctorsRepository
  extends PrismaBaseRepository
  implements IDoctorsRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  private buildWhereClause(query: GetDoctorQuery): Prisma.DoctorWhereInput {
    const where: Prisma.DoctorWhereInput = {};

    if (query.specialization_id) {
      where.specialization_id = query.specialization_id;
    }

    if (query.professional_since_from && query.professional_since_to) {
      where.professional_since = {
        gte: query.professional_since_from,
        lte: query.professional_since_to,
      };
    }

    if (query.search) {
      where.OR = [
        { hospital_name: { contains: query.search, mode: 'insensitive' } },
        { licence_number: { contains: query.search, mode: 'insensitive' } },
        {
          user: { first_name: { contains: query.search, mode: 'insensitive' } },
        },
        {
          user: { last_name: { contains: query.search, mode: 'insensitive' } },
        },
        { user: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    return where;
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

  async findAll(
    query: GetDoctorQuery,
    tx?: unknown,
  ): Promise<{ data: DoctorReturnType[]; total: number }> {
    const prisma = this.getClient(tx);

    const where = this.buildWhereClause(query);

    const [data, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: { user: true, specialization: true, doctorsRating: true },
        skip: query.offset ? Number(query.offset) : undefined,
        take: query.limit ? Number(query.limit) : undefined,
      }),
      prisma.doctor.count({
        where,
      }),
    ]);

    return { data, total };
  }

  async findOne(id: number, tx?: unknown): Promise<DoctorReturnType | null> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
        specialization: true,
        doctorsRating: { include: { patient: { include: { user: true } } } },
      },
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
    doctor: Partial<DoctorEntity>,
    tx?: unknown,
  ): Promise<DoctorReturnType> {
    const prisma = this.getClient(tx);

    return await prisma.doctor.update({
      where: {
        id,
      },
      data: {
        ...(doctor.phoneNumber && { phone_number: doctor.phoneNumber }),
        ...(doctor.licenceNumber && { licence_number: doctor.licenceNumber }),
        ...(doctor.specializationId && {
          specialization_id: doctor.specializationId,
        }),
        ...(doctor.hospital_address && {
          hospital_address: doctor.hospital_address,
        }),
        ...(doctor.hospital_name && { hospital_name: doctor.hospital_name }),
        ...(doctor.professional_since && {
          professional_since: doctor.professional_since,
        }),
      },
      include: { user: true, specialization: true },
    });
  }
}
