import { ILogger } from 'src/common/interfaces/logger.interface';
import { IRolesRepository } from './roles.repository.interface';
import { RolesService } from './roles.service';
import { IRolesService } from './roles.service.interface';
import { ResponseStatus } from 'src/common/service-response';

const mockLogger: jest.Mocked<ILogger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mockRolesRepository: jest.Mocked<IRolesRepository> = {
  findAll: jest.fn(),
  findByName: jest.fn(),
  create: jest.fn(),
};

describe('RolesService', () => {
  let service: IRolesService;

  beforeEach(async () => {
    service = new RolesService(mockLogger, mockRolesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return conflict error if role already exists', async () => {
      mockRolesRepository.findByName.mockResolvedValueOnce({
        id: 1,
        role_name: 'doctor',
      });

      const role = await service.create('doctor');

      expect(role.error?.status).toBe(ResponseStatus.Conflict);
    });

    it('should return error on repository error', async () => {
      mockRolesRepository.findByName.mockRejectedValueOnce(
        'Error finding role',
      );

      const role = await service.create('doctor');

      expect(role.data).toBeNull();
      expect(role.error?.message).toBe('Error creating role');
    });

    it('should return success response', async () => {
      mockRolesRepository.findByName.mockResolvedValueOnce(null);

      mockRolesRepository.create.mockResolvedValueOnce({
        id: 1,
        role_name: 'doctor',
      });

      const role = await service.create('doctor');

      expect(role.error).toBeNull();
      expect(role.data?.id).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      mockRolesRepository.findAll.mockResolvedValue(
        Promise.resolve([
          { id: 1, role_name: 'doctor' },
          { id: 2, role_name: 'patient' },
        ]),
      );
      const roles = await service.findAll();

      expect(roles.error).toBeNull();
      expect(roles.data?.length).toBeGreaterThan(0);
    });

    it('should return error if repository throws error', async () => {
      mockRolesRepository.findAll.mockRejectedValue(
        new Error('Error finding roles'),
      );
      const roles = await service.findAll();

      expect(roles.error?.message).not.toBeNull();
      expect(roles.data).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return role by name', async () => {
      mockRolesRepository.findByName.mockResolvedValue(
        Promise.resolve({ id: 1, role_name: 'doctor' }),
      );
      const role = await service.findByName('doctor');

      expect(role.error).toBeNull();
      expect(role.data?.role_name).toBe('doctor');
    });

    it('should return error if repository throws error', async () => {
      mockRolesRepository.findByName.mockRejectedValue(
        new Error('Error finding role'),
      );
      const role = await service.findByName('doctor');

      expect(role.error?.message).not.toBeNull();
      expect(role.data).toBeNull();
    });

    it('should return not found if role not found', async () => {
      mockRolesRepository.findByName.mockResolvedValue(null);
      const role = await service.findByName('doctor');

      expect(role.data).toBeNull();
      expect(role.error?.status).not.toBeNull();
    });
  });
});
