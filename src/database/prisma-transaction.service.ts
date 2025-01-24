import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTransactionManager implements ITransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  async transaction<T>(callback: (tx: unknown) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(callback);
  }
}
