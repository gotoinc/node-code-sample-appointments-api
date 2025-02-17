import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { Logger } from 'nestjs-pino';
import {
  EmailCredentialsServiceSymbol,
  IEmailCredentialsService,
} from 'src/iam/authentication/email-credentials/email-credentials.service.interface';
import {
  IUsersService,
  UsersServiceSymbol,
} from 'src/users/users.service.interface';
import {
  HashingServiceSymbol,
  IHashingService,
} from './hashing/hashing.service.interface';
import {
  ITokenGenerationService,
  TokenGenerationServiceSymbol,
} from './token-generation/token-generation.service.interface';
import { RegisterUserDto } from './dto/register-user.dto';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let mockLogger: jest.Mocked<Logger>;
  let mockEmailCredentialsService: jest.Mocked<IEmailCredentialsService>;
  let mockUsersService: jest.Mocked<IUsersService>;
  let mockHashingService: jest.Mocked<IHashingService>;
  let mockTokenGenerationService: jest.Mocked<ITokenGenerationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: EmailCredentialsServiceSymbol,
          useValue: {
            findOne: jest.fn(),
            createNewUser: jest.fn(),
          },
        },
        {
          provide: UsersServiceSymbol,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: HashingServiceSymbol,
          useValue: {
            hash: jest.fn().mockReturnValue('hashed-password'),
            verify: jest.fn(),
          },
        },
        {
          provide: TokenGenerationServiceSymbol,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    mockLogger = module.get(Logger);
    mockEmailCredentialsService = module.get(EmailCredentialsServiceSymbol);
    mockUsersService = module.get(UsersServiceSymbol);
    mockHashingService = module.get(HashingServiceSymbol);
    mockTokenGenerationService = module.get(TokenGenerationServiceSymbol);
  });

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
    created_at: new Date(),
    updated_at: new Date(),
    user_role_id: 1,
    user_role: {
      id: 1,
      role_name: 'user',
    },
  };

  const mockCredentials = {
    id: 1,
    email: 'test@example.com',
    password_hash: 'existing-hash',
    user_id: 1,
  };

  describe('login', () => {
    const loginEmail = 'test@example.com';
    const loginPassword = 'password123';

    it('should successfully login with valid credentials', async () => {
      const mockToken = 'mock-access-token';

      mockEmailCredentialsService.findOne.mockResolvedValue({
        error: null,
        data: mockCredentials,
      });
      mockHashingService.verify.mockReturnValue(true);
      mockUsersService.findOne.mockResolvedValue({
        error: null,
        data: mockUser,
      });
      mockTokenGenerationService.generateToken.mockResolvedValue({
        error: null,
        data: mockToken,
      });

      const result = await service.login(loginEmail, loginPassword);

      expect(result.error).toBeNull();
      expect(result.data?.accessToken).toBe(mockToken);
    });

    it('should fail login when credentials lookup fails', async () => {
      mockEmailCredentialsService.findOne.mockResolvedValue({
        error: { message: 'Lookup error' },
        data: null,
      });

      const result = await service.login(loginEmail, loginPassword);

      expect(result.error?.message).toBe('Invalid email or password');
      expect(result.data).toBeNull();
    });

    it('should fail login with incorrect password', async () => {
      mockEmailCredentialsService.findOne.mockResolvedValue({
        error: null,
        data: mockCredentials,
      });
      mockHashingService.verify.mockReturnValue(false);

      const result = await service.login(loginEmail, loginPassword);

      expect(result.error?.message).toBe('Invalid email or password');
      expect(result.data).toBeNull();
    });

    it('should fail login when user not found', async () => {
      mockEmailCredentialsService.findOne.mockResolvedValue({
        error: null,
        data: mockCredentials,
      });
      mockHashingService.verify.mockReturnValue(true);
      mockUsersService.findOne.mockResolvedValue({
        error: null,
        data: null,
      });

      const result = await service.login(loginEmail, loginPassword);

      expect(result.error?.message).toBe('Invalid email or password');
      expect(result.data).toBeNull();
    });

    it('should fail login when token generation fails', async () => {
      mockEmailCredentialsService.findOne.mockResolvedValue({
        error: null,
        data: mockCredentials,
      });
      mockHashingService.verify.mockReturnValue(true);
      mockUsersService.findOne.mockResolvedValue({
        error: null,
        data: mockUser,
      });
      mockTokenGenerationService.generateToken.mockResolvedValue({
        error: { message: 'Token generation failed' },
        data: null,
      });

      const result = await service.login(loginEmail, loginPassword);

      expect(result.error?.message).toBe('Token generation failed');
      expect(result.data).toBeNull();
    });

    it('should handle unexpected errors during login', async () => {
      mockEmailCredentialsService.findOne.mockRejectedValue(
        new Error('Unexpected error'),
      );

      const result = await service.login(loginEmail, loginPassword);

      expect(result.error?.message).toBe('Login failed. Please try again.');
      expect(result.data).toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerDto: RegisterUserDto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@example.com',
      password: 'password123',
      role: 'patient',
    };

    it('should successfully register a new user', async () => {
      const registeredUser = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        user_role_id: 1,
      };

      mockUsersService.findOne.mockResolvedValue({
        error: null,
        data: null,
      });
      mockHashingService.hash.mockReturnValue('hashed-password');
      mockEmailCredentialsService.createNewUser.mockResolvedValue({
        error: null,
        data: {
          id: 1,
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          created_at: new Date(),
          updated_at: new Date(),
          user_role_id: 1,
        },
      });

      const result = await service.register(registerDto);

      expect(result.error).toBeNull();
      expect(result.data).toEqual(registeredUser);
    });

    it('should fail registration when users service lookup fails', async () => {
      mockUsersService.findOne.mockResolvedValue({
        error: { message: 'User lookup error' },
        data: null,
      });

      const result = await service.register(registerDto);

      expect(result.error?.message).toBe('User lookup error');
      expect(result.data).toBeNull();
    });

    it('should fail registration for existing email', async () => {
      mockUsersService.findOne.mockResolvedValue({
        error: null,
        data: mockUser,
      });

      const result = await service.register(registerDto);

      expect(result.error?.message).toBe('User with such email already exists');
      expect(result.data).toBeNull();
    });

    it('should fail registration when creating user fails', async () => {
      mockUsersService.findOne.mockResolvedValue({
        error: null,
        data: null,
      });
      mockHashingService.hash.mockReturnValue('hashed-password');
      mockEmailCredentialsService.createNewUser.mockResolvedValue({
        error: { message: 'User creation failed' },
        data: null,
      });

      const result = await service.register(registerDto);

      expect(result.error?.message).toBe('User creation failed');
      expect(result.data).toBeNull();
    });

    it('should handle unexpected errors during registration', async () => {
      mockUsersService.findOne.mockRejectedValue(new Error('Unexpected error'));

      const result = await service.register(registerDto);

      expect(result.error?.message).toBe('Error while creating user');
      expect(result.data).toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
