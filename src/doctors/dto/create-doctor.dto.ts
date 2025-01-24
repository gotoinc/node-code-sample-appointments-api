import {
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateDoctorDto {
  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  licence_number: string;

  @IsNumber()
  @Min(1, { message: 'Specialization ID must be a positive integer' })
  specializationId: number;
}
