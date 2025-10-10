import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateDoctorsRatingDto {
  @IsNumber()
  @Min(1, { message: 'Doctor ID must be a positive number' })
  doctor_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Rating must be between 1 and 5' })
  @Max(5, { message: 'Rating must be between 1 and 5' })
  rating: number;

  @IsOptional()
  @IsString()
  review: string;
}
