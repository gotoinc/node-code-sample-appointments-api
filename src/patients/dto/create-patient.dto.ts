import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsDateString({ strict: true })
  date_of_birth: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
