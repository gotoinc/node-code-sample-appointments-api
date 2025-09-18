import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateDoctorsRatingDto {
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Rating must be between 1 and 5' })
  @Max(5, { message: 'Rating must be between 1 and 5' })
  rating: number;

  @IsString()
  review: string;
}
