import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';
import { DoctorsModule } from './doctors/doctors.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    IamModule,
    RolesModule,
    UsersModule,
    DoctorsModule,
    SpecializationsModule,
    PatientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
