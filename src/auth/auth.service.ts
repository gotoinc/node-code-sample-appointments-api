import { Inject, Injectable } from '@nestjs/common';
import { EmailCredentialsService } from './email-credentials.service';
import { UsersService } from 'src/users/users.service';
import { IServiceResponse } from 'src/common/service-response.interface';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashingService } from './hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('EMAIL_CREDENTIALS_SERVICE')
    private readonly emailCredentialsService: EmailCredentialsService,
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('HASHING_SERVICE') private readonly hashingService: HashingService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<
    IServiceResponse<Pick<User, 'id' | 'email' | 'first_name' | 'last_name'>>
  > {
    const { error, data: userCredentials } =
      await this.emailCredentialsService.findOne(email);
    if (error) return { error: error, data: null };
    const isValidCredentials = this.hashingService.verify(
      pass,
      userCredentials.passwordHash,
    );
    if (!isValidCredentials)
      return { error: { message: 'Invalid credentials' }, data: null };
    const { error: errorFindUser, data: user } =
      await this.usersService.findOne(email);
    if (errorFindUser) return { error: errorFindUser, data: null };
    const result = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    return { error: null, data: result };
  }

  async login(id: number, email: string) {
    const token = await this.jwtService.signAsync(
      {
        sub: id,
        email: email,
        iat: Math.floor(Date.now() / 1000),
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: +this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRES_IN',
        ),
        issuer: this.configService.get<string>('JWT_ISSUER'),
        audience: this.configService.get<string>('JWT_AUDIENCE'),
      },
    );

    return token;
  }
}
