import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  patient_insurance_number: string;

  @IsString()
  reason: string;

  @IsNumber()
  timeslot_id: number;

  @IsNumber()
  doctor_id: number;
}
