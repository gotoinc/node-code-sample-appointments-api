import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleOauthQueryParamsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['patient', 'doctor'])
  role: 'patient' | 'doctor';

  @IsString()
  @IsNotEmpty()
  @IsEnum(['login', 'register'])
  action: 'login' | 'register';
}
