import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    IamModule,
    RolesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
