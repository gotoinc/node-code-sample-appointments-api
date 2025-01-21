import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class GoogleOauthQueryParamsDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['patient', 'doctor'])
  role: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['login', 'register'])
  action: string;
}
