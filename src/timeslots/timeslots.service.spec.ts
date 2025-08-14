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
  createMany: jest.fn(),
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

  describe('createSchedule', () => {
    const userId = 1;
    const doctor = {
      id: 1,
      phone_number: '+1234567890',
      licence_number: '1234567890',
      specialization_id: 1,
      user_id: 1,
    };
    const timeslotsDto = {
      timeslots: [
        {
          start_time: '2024-06-01T10:00:00.000Z',
          end_time: '2024-06-01T10:30:00.000Z',
        },
        {
          start_time: '2024-06-01T11:00:00.000Z',
          end_time: '2024-06-01T11:30:00.000Z',
        },
      ],
    };

    const timeslotsWithColission = {
      timeslots: [
        {
          start_time: '2024-06-01T10:00:00.000Z',
          end_time: '2024-06-01T10:30:00.000Z',
        },
        {
          start_time: '2024-06-01T10:00:00.000Z',
          end_time: '2024-06-01T11:30:00.000Z',
        },
      ],
    };

    it('should return error if doctor service returns error', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: null,
        error: { message: 'Some error' },
      });

      const result = await service.createSchedule(timeslotsDto, userId);

      expect(result.data).toBeNull();
      expect(result.error).toEqual({ message: 'Some error' });
    });

    it('should return not found if doctor not found', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const result = await service.createSchedule(timeslotsDto, userId);

      expect(result.data).toBeNull();
      expect(result.error?.status).toBe(ResponseStatus.NotFound);
    });

    it('should return conflict if any timeslot collides', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: doctor,
        error: null,
      });
      // First timeslot has collision
      mockTimeslotsRepository.findCollisions
        .mockResolvedValueOnce([{} as any])
        .mockResolvedValueOnce([]);

      const result = await service.createSchedule(timeslotsDto, userId);

      expect(result.data).toBeNull();
      expect(result.error?.status).toBe(ResponseStatus.Conflict);
      expect(result.error?.message).toContain('Timeslot collision');
    });

    it('should return error if repository throws error', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: doctor,
        error: null,
      });
      mockTimeslotsRepository.findCollisions.mockResolvedValue([]);
      mockTimeslotsRepository.createMany.mockRejectedValueOnce(
        new Error('DB error'),
      );

      const result = await service.createSchedule(timeslotsDto, userId);

      expect(result.data).toBeNull();
      expect(result.error).not.toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    });
    it('should return error if timeslots has collision', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: doctor,
        error: null,
      });
      mockTimeslotsRepository.findCollisions.mockResolvedValue([]);
      mockTimeslotsRepository.createMany.mockResolvedValueOnce({ count: 2 });

      const result = await service.createSchedule(
        timeslotsWithColission,
        userId,
      );

      expect(result.data).toBeNull();
      expect(result.error?.status).toBe(ResponseStatus.Conflict);
      expect(result.error?.message).toContain('Timeslot collision');
    });

    it('should return success if all timeslots created', async () => {
      mockDoctorsService.findByUserId.mockResolvedValueOnce({
        data: doctor,
        error: null,
      });
      mockTimeslotsRepository.findCollisions.mockResolvedValue([]);
      mockTimeslotsRepository.createMany.mockResolvedValueOnce({ count: 2 });

      const result = await service.createSchedule(timeslotsDto, userId);

      expect(result.error).toBeNull();
      expect(result.data).toEqual({ status: 'ok' });
    });
  });
});
