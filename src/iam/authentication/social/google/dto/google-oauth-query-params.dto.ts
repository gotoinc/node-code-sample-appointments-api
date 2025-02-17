import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleOauthQueryParamsDto {
  @ApiProperty({ required: true, enum: ['patient', 'doctor'] })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['patient', 'doctor'])
  role: 'patient' | 'doctor';

  @ApiProperty({ required: true, enum: ['login', 'register'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['login', 'register'])
  action: 'login' | 'register';
}
