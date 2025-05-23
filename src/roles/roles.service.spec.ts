import { ILogger } from 'src/common/interfaces/logger.interface';
import { IRolesRepository } from './roles.repository.interface';
import { RolesService } from './roles.service';
import { IRolesService } from './roles.service.interface';

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
      expect(role.data?.name).toBe('doctor');
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
