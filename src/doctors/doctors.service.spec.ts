import { DoctorsService } from './doctors.service';
import { IDoctorsRepository } from './doctors.repository.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { IDoctorsService } from './doctors.service.interface';
import { ISpecializationsService } from 'src/specializations/specializations.service.interface';
import { ResponseStatus } from 'src/common/service-response';

const mockLogger: jest.Mocked<ILogger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mockDoctorsRepository: jest.Mocked<IDoctorsRepository> = {
  findOne: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockSpecializationsService: jest.Mocked<ISpecializationsService> = {
  findAll: jest.fn(),
  findByName: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
};

describe('DoctorsService', () => {
  let service: IDoctorsService;

  beforeEach(() => {
    service = new DoctorsService(
      mockLogger,
      mockDoctorsRepository,
      mockSpecializationsService,
    );
  });

  describe('create', () => {
    it('should return error if specialization not found', async () => {
      mockSpecializationsService.findOne.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const doctor = await service.create(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.error?.status).toBe(ResponseStatus.InvalidData);
    });

    it('should return error if specialization service return error', async () => {
      mockSpecializationsService.findOne.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error finding specialization' },
      });

      const doctor = await service.create(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.data).toBeNull();
      expect(doctor.error).not.toBeNull();
    });

    it('should return error if doctor already exists', async () => {
      mockSpecializationsService.findOne.mockResolvedValueOnce({
        data: {
          id: 1,
          name: 'Doctor',
        },
        error: null,
      });

      mockDoctorsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        phone_number: '+1234567890',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      const doctor = await service.create(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.error?.status).toBe(ResponseStatus.Conflict);
    });

    it('should return error if doctors repository throws error', async () => {
      mockSpecializationsService.findOne.mockResolvedValueOnce({
        data: {
          id: 1,
          name: 'Doctor',
        },
        error: null,
      });

      mockDoctorsRepository.findByUserId.mockRejectedValueOnce(
        'Error finding doctor',
      );

      const doctor = await service.create(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.data).toBeNull();
      expect(doctor.error).not.toBeNull();
    });

    it('should return success response', async () => {
      mockSpecializationsService.findOne.mockResolvedValueOnce({
        data: {
          id: 1,
          name: 'Doctor',
        },
        error: null,
      });

      mockDoctorsRepository.findByUserId.mockResolvedValueOnce(null);

      mockDoctorsRepository.create.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        phone_number: '+1234567890',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      const doctor = await service.create(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.error).toBeNull();
      expect(doctor.data?.phone_number).toBe('+1234567890');
    });
  });

  describe('findAll', () => {
    it('should return all doctors', async () => {
      mockDoctorsRepository.findAll.mockResolvedValueOnce([
        {
          id: 1,
          user_id: 1,
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specialization_id: 1,
        },
        {
          id: 2,
          user_id: 2,
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specialization_id: 2,
        },
      ]);

      const doctors = await service.findAll();

      expect(doctors.error).toBeNull();
      expect(doctors.data?.length).toBe(2);
    });

    it('should return error if repository throws error', async () => {
      mockDoctorsRepository.findAll.mockRejectedValueOnce(
        'Error finding doctors',
      );

      const doctors = await service.findAll();

      expect(doctors.data).toBeNull();
      expect(doctors.error).not.toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return doctor by id', async () => {
      mockDoctorsRepository.findOne.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        phone_number: '+1234567890',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      const doctor = await service.findOne(1);

      expect(doctor.error).toBeNull();
      expect(doctor.data?.phone_number).toBe('+1234567890');
    });

    it('should return error if repository throws error', async () => {
      mockDoctorsRepository.findOne.mockRejectedValueOnce(
        'Error finding doctor',
      );

      const doctor = await service.findOne(1);

      expect(doctor.data).toBeNull();
      expect(doctor.error).not.toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return doctor by user id', async () => {
      mockDoctorsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        phone_number: '+1234567890',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      const doctor = await service.findByUserId(1);

      expect(doctor.error).toBeNull();
      expect(doctor.data?.phone_number).toBe('+1234567890');
    });

    it('should return error if repository throws error', async () => {
      mockDoctorsRepository.findByUserId.mockRejectedValueOnce(
        'Error finding doctor',
      );

      const doctor = await service.findByUserId(1);

      expect(doctor.data).toBeNull();
      expect(doctor.error).not.toBeNull();
    });
  });

  describe('update', () => {
    it('should update a doctor if they exist', async () => {
      mockDoctorsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        phone_number: '+1234567890',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      mockSpecializationsService.findOne.mockResolvedValueOnce({
        data: {
          id: 1,
          name: 'Doctor',
        },
        error: null,
      });

      mockDoctorsRepository.update.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        phone_number: '+4444444444',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      const doctor = await service.update(
        {
          phone_number: '+4444444444',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.error).toBeNull();
      expect(doctor.data?.phone_number).toBe('+4444444444');
    });

    it('should return error if user does not match', async () => {
      mockDoctorsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 2,
        phone_number: '+1234567890',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      const doctor = await service.update(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.error?.status).toBe(ResponseStatus.Forbidden);
    });

    it('should return error if repository throws error', async () => {
      mockDoctorsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        phone_number: '+1234567890',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      mockDoctorsRepository.update.mockRejectedValueOnce(
        'Error updating doctor',
      );

      const doctor = await service.update(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.data).toBeNull();
      expect(doctor.error).not.toBeNull();
    });

    it('should return error if doctor not found', async () => {
      mockDoctorsRepository.findByUserId.mockResolvedValueOnce(null);

      const doctor = await service.update(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.data).toBeNull();
      expect(doctor.error).not.toBeNull();
    });

    it('should return error if specialization not found', async () => {
      mockDoctorsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        phone_number: '+1234567890',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      mockSpecializationsService.findOne.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const doctor = await service.update(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.data).toBeNull();
      expect(doctor.error?.status).toBe(ResponseStatus.InvalidData);
    });

    it('should return error if specialization service return error', async () => {
      mockDoctorsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        phone_number: '+1234567890',
        licence_number: '1234567890',
        specialization_id: 1,
      });

      mockSpecializationsService.findOne.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error finding specialization' },
      });

      const doctor = await service.update(
        {
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specializationId: 1,
        },
        1,
      );

      expect(doctor.data).toBeNull();
      expect(doctor.error).not.toBeNull();
    });
  });
});
