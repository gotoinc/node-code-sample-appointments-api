import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    PrismaService,
    {
      provide: 'USERS_SERVICE',
      useFactory: (prisma: PrismaService) => {
        return new UsersService(prisma);
      },
      inject: [PrismaService],
    },
  ],
  exports: ['USERS_SERVICE'],
})
export class UsersModule {}
