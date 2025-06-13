import { ILogger } from 'src/common/interfaces/logger.interface';
import { ITimeslotsRepository } from './timeslots.repository.interface';
import { ITimeslotsService } from './timeslots.service.interface';
import { TimeslotsService } from './timeslots.service';
import { IDoctorsService } from 'src/doctors/doctors.service.interface';
import { ResponseStatus } from 'src/common/service-response';

const mockLogger: jest.Mocked<ILogger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mockTimeslotsRepository: jest.Mocked<ITimeslotsRepository> = {
  findById: jest.fn(),
  findCollisions: jest.fn(),
  create: jest.fn(),
  setUnavailable: jest.fn(),
  findManyByDoctorId: jest.fn(),
};

const mockDoctorsService: jest.Mocked<IDoctorsService> = {
  findOne: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

describe('TimeslotsService', () => {
  let service: ITimeslotsService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    service = new TimeslotsService(
      mockLogger,
      mockTimeslotsRepository,
      mockDoctorsService,
    );
  });

  describe('create', () => {
    it('should return error if doctor not found', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const timeslot = await service.create(
        {
          start_time: '2022-01-01:00:00:00',
          end_time: '2022-01-01:00:00:00',
        },
        1,
      );

      expect(timeslot.data).toBeNull();
      expect(timeslot.error?.status).toBe(ResponseStatus.NotFound);
    });

    it('should return error if doctor service throws error', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specialization_id: 1,
          user_id: 1,
        },
        error: null,
      });

      mockTimeslotsRepository.create.mockRejectedValueOnce(
        'Error creating timeslot',
      );

      const timeslot = await service.create(
        {
          start_time: '2022-01-01:00:00:00',
          end_time: '2022-01-01:00:00:00',
        },
        1,
      );

      expect(timeslot.data).toBeNull();
      expect(timeslot.error).not.toBeNull();
    });

    it('should return error if timeslot already exists', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specialization_id: 1,
          user_id: 1,
        },
        error: null,
      });

      mockTimeslotsRepository.findCollisions.mockResolvedValueOnce([
        {
          id: 1,
          doctor_id: 1,
          start_time: new Date(),
          end_time: new Date(),
          is_available: true,
        },
      ]);

      const timeslot = await service.create(
        {
          start_time: '2022-01-01:00:00:00',
          end_time: '2022-01-01:00:00:00',
        },
        1,
      );

      expect(timeslot.error?.status).toBe(ResponseStatus.Conflict);
    });

    it('should return error if timeslots repository throws error', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specialization_id: 1,
          user_id: 1,
        },
        error: null,
      });

      mockTimeslotsRepository.findCollisions.mockResolvedValueOnce([]);

      mockTimeslotsRepository.create.mockRejectedValueOnce(
        'Error creating timeslot from test',
      );

      const timeslot = await service.create(
        {
          start_time: '2022-01-01:00:00:00',
          end_time: '2022-01-01:00:00:00',
        },
        1,
      );

      expect(timeslot.data).toBeNull();
      expect(timeslot.error).not.toBeNull();
    });

    it('should return success response', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          phone_number: '+1234567890',
          licence_number: '1234567890',
          specialization_id: 1,
          user_id: 1,
        },
        error: null,
      });
      mockTimeslotsRepository.findCollisions.mockResolvedValueOnce([]);
      mockTimeslotsRepository.create.mockResolvedValueOnce({
        id: 1,
        doctor_id: 1,
        start_time: new Date(),
        end_time: new Date(),
        is_available: true,
      });
      const timeslot = await service.create(
        {
          start_time: '2022-01-01:00:00:00',
          end_time: '2022-01-01:00:00:00',
        },
        1,
      );
      expect(timeslot.error).toBeNull();
      expect(timeslot.data?.id).toBe(1);
    });
  });

  describe('findByDoctorId', () => {
    it('should return all timeslots for doctor', async () => {
      mockTimeslotsRepository.findManyByDoctorId.mockResolvedValueOnce([
        {
          id: 1,
          doctor_id: 1,
          start_time: new Date(),
          end_time: new Date(),
          is_available: false,
        },
        {
          id: 2,
          doctor_id: 1,
          start_time: new Date(),
          end_time: new Date(),
          is_available: true,
        },
      ]);

      const timeslots = await service.findByDoctorId(1, {
        from: 1738850104951,
        to: 1738850104951,
      });

      expect(timeslots.error).toBeNull();
      expect(timeslots.data?.length).toBe(2);
    });

    it('should return error if repository throws error', async () => {
      mockTimeslotsRepository.findManyByDoctorId.mockRejectedValueOnce(
        'Error finding timeslots',
      );

      const timeslots = await service.findByDoctorId(1, {
        from: 1738850104951,
        to: 1738850104951,
      });

      expect(timeslots.data).toBeNull();
      expect(timeslots.error).not.toBeNull();
    });
  });

  describe('findById', () => {
    it('should return timeslot by id', async () => {
      mockTimeslotsRepository.findById.mockResolvedValueOnce({
        id: 1,
        doctor_id: 1,
        start_time: new Date(),
        end_time: new Date(),
        is_available: false,
      });

      const timeslot = await service.findById(1);

      expect(timeslot.error).toBeNull();
      expect(timeslot.data?.id).toBe(1);
    });

    it('should return error if repository throws error', async () => {
      mockTimeslotsRepository.findById.mockRejectedValueOnce(
        'Error finding timeslot',
      );

      const timeslot = await service.findById(1);

      expect(timeslot.data).toBeNull();
      expect(timeslot.error).not.toBeNull();
    });

    it('should return not found if timeslot not found', async () => {
      mockTimeslotsRepository.findById.mockResolvedValueOnce(null);

      const timeslot = await service.findById(1);

      expect(timeslot.data).toBeNull();
      expect(timeslot.error?.status).toBe(ResponseStatus.NotFound);
    });
  });
});
