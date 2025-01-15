import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
    JwtAuthGuard,
  ],
  exports: ['USERS_SERVICE'],
})
export class UsersModule {}
