import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class DoctorIdParamDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1, { message: 'Doctor ID must be a positive integer or string' })
  doctorId: number;
}
