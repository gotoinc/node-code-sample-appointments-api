import { ApiProperty } from '@nestjs/swagger';
import { DoctorDto } from './doctor.dto';
import { PatientDto } from 'src/patients/dto/patient.dto';

export class DoctorsRatingDto {
  id: number;

  rating: number;

  review: string | null;

  @ApiProperty({ type: () => DoctorDto })
  doctor: DoctorDto;

  @ApiProperty({ type: () => PatientDto })
  patient: PatientDto;
}
