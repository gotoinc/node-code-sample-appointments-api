import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString, IsDateString } from 'class-validator';

export class GetDoctorQuery {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  specialization_id?: number;

  @IsOptional()
  @IsDateString()
  professional_since_from?: string;

  @IsOptional()
  @IsDateString()
  professional_since_to?: string;
}
