import { PrismaService } from './prisma.service';

export class PrismaBaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  protected getClient(tx?: unknown) {
    return (tx as PrismaService) || this.prisma;
  }
}
