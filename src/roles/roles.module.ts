import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [RolesController],
  providers: [
    PrismaService,
    {
      provide: 'ROLES_SERVICE',
      useFactory: (prisma: PrismaService) => {
        return new RolesService(prisma);
      },
      inject: [PrismaService],
    },
  ],
})
export class RolesModule {}
