import { GoogleOauthService } from './google-oauth.service';
import { IAuthMethodsService } from '../../auth-methods/auth-methods.service.interface';
import { IUsersService } from 'src/users/users.service.interface';
import { ITokenGenerationService } from '../../token-generation/token-generation.service.interface';
import { ResponseStatus, ServiceResponse } from 'src/common/service-response';

jest.mock('../../auth-methods/auth-methods.service.interface');
jest.mock('src/users/users.service.interface');
jest.mock('../../token-generation/token-generation.service.interface');

describe('GoogleOauthService', () => {
  let service: GoogleOauthService;
  let authMethodsService: jest.Mocked<IAuthMethodsService>;
  let usersService: jest.Mocked<IUsersService>;
  let tokenGenerationService: jest.Mocked<ITokenGenerationService>;

  beforeEach(() => {
    authMethodsService = {
      findOne: jest.fn(),
      createNewUser: jest.fn(),
    } as jest.Mocked<IAuthMethodsService>;

    usersService = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<IUsersService>;

    tokenGenerationService = {
      generateToken: jest.fn(),
    } as jest.Mocked<ITokenGenerationService>;

    service = new GoogleOauthService(
      authMethodsService,
      usersService,
      tokenGenerationService,
    );
  });

  describe('login', () => {
    it('should return an access token if login is successful', async () => {
      authMethodsService.findOne.mockResolvedValue(
        ServiceResponse.success({
          user_id: 1,
          id: 1,
          email: 'test@example.com',
          auth_provider_id: 1,
        }),
      );
      usersService.findOne.mockResolvedValue(
        ServiceResponse.success({
          id: 1,
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          created_at: new Date(),
          updated_at: new Date(),
          user_role_id: 1,
          user_role: { role_name: 'doctor', id: 1 },
        }),
      );
      tokenGenerationService.generateToken.mockResolvedValue(
        ServiceResponse.success('access-token'),
      );

      const result = await service.login('test@example.com');
      expect(result).toEqual(
        ServiceResponse.success({ access_token: 'access-token' }),
      );
    });

    it('should return an error if auth method is not found', async () => {
      authMethodsService.findOne.mockResolvedValue(
        ServiceResponse.notFound('Not found'),
      );

      const result = await service.login('test@example.com');
      expect(result.error?.status).toEqual(ResponseStatus.NotFound);
    });
  });

  describe('register', () => {
    it('should return conflict if user already exists', async () => {
      authMethodsService.findOne.mockResolvedValue(
        ServiceResponse.success({
          email: 'test@example.com',
          id: 1,
          user_id: 1,
          auth_provider_id: 1,
        }),
      );

      const result = await service.register(
        'test@example.com',
        'John',
        'Doe',
        'doctor',
      );
      expect(result).toEqual(
        ServiceResponse.conflict('User with such email already exists'),
      );
    });

    it('should return success if user is created successfully', async () => {
      authMethodsService.findOne.mockResolvedValue({ error: null, data: null });
      authMethodsService.createNewUser.mockResolvedValue(
        ServiceResponse.success({
          email: 'test@example.com',
          id: 1,
          user_id: 1,
          auth_provider_id: 1,
        }),
      );

      const result = await service.register(
        'test@example.com',
        'John',
        'Doe',
        'doctor',
      );
      expect(result).toEqual(
        ServiceResponse.success({ email: 'test@example.com' }),
      );
    });
  });
});
