import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PatientIdParamDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1, { message: 'Patient ID must be a positive integer or string' })
  patientId: number;
}
