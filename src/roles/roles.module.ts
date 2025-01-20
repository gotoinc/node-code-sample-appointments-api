import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from 'src/database/prisma.service';
import { RolesRepository } from './roles.repository';
import { IRolesRepository } from './roles.repository.interface';
import { RolesServiceSymbol } from './roles.service.interface';

@Module({
  controllers: [RolesController],
  providers: [
    PrismaService,
    RolesRepository,
    {
      provide: RolesServiceSymbol,
      useFactory: (rolesRepository: IRolesRepository) => {
        return new RolesService(rolesRepository);
      },
      inject: [RolesRepository],
    },
  ],
  exports: [RolesServiceSymbol, RolesRepository],
})
export class RolesModule {}
