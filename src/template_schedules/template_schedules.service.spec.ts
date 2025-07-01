import { TemplateScheduleService } from './template_schedules.service';
import { ServiceResponse } from 'src/common/service-response';
import { TemplateSchedule } from '@prisma/client';
import { CreateTemplateScheduleDto } from './dto/createTemplateSchedule.dto';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { IDoctorsService } from 'src/doctors/doctors.service.interface';
import { DoctorReturnType } from 'src/doctors/doctors.repository.interface';

function createMockDoctor(overrides = {}): DoctorReturnType {
  return {
    id: 1,
    phone_number: '1234567890',
    licence_number: 'XYZ123',
    specialization_id: 1,
    user_id: 1,
    specialization: {
      id: 1,
      name: 'Doctor',
    },
    user: {
      id: 1,
      email: 'doctor@example.com',
      first_name: 'John',
      last_name: 'Doe',
      created_at: new Date(),
      updated_at: new Date(),
      user_role_id: 2,
    },
    ...overrides,
  };
}

const mockLogger: ILogger = {
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
};

const mockTemplateRepository = {
  create: jest.fn(),
  findAllByDoctorId: jest.fn(),
  findById: jest.fn(),
};

const mockDoctorsService: jest.Mocked<IDoctorsService> = {
  findOne: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const makeService = () =>
  new TemplateScheduleService(
    mockLogger,
    mockTemplateRepository,
    mockDoctorsService,
  );

describe('Template Schedule Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 1;
    const doctor = createMockDoctor();
    const templateDto: CreateTemplateScheduleDto = {
      name: 'Test Template',
      schedule: {
        monday: {
          start_time: '09:00',
          end_time: '17:00',
        },
      },
      slotDuration: 30,
    };
    const createdTemplate: TemplateSchedule = {
      id: 1,
      doctor_id: doctor.id,
      name: templateDto.name,
      schedule: templateDto.schedule as any,
      slotDuration: templateDto.slotDuration,
    };

    it('should create a template schedule successfully', async () => {
      mockDoctorsService.findByUserId.mockResolvedValue({
        error: null,
        data: doctor,
      });
      mockTemplateRepository.create.mockResolvedValue(createdTemplate);

      const service = makeService();
      const result = await service.create(templateDto, userId);

      expect(mockDoctorsService.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockTemplateRepository.create).toHaveBeenCalledWith({
        doctor_id: doctor.id,
        name: templateDto.name,
        schedule: templateDto.schedule,
        slotDuration: templateDto.slotDuration,
      });
      expect(result).toEqual(ServiceResponse.success(createdTemplate));
    });

    it('should return error if doctor service returns error', async () => {
      const error = { message: 'Doctor error' };
      mockDoctorsService.findByUserId.mockResolvedValue({ error, data: null });

      const service = makeService();
      const result = await service.create(templateDto, userId);

      expect(result).toEqual({ error, data: null });
      expect(mockTemplateRepository.create).not.toHaveBeenCalled();
    });

    it('should return not found if doctor is not found', async () => {
      mockDoctorsService.findByUserId.mockResolvedValue({
        error: null,
        data: null,
      });

      const service = makeService();
      const result = await service.create(templateDto, userId);

      expect(result).toEqual(ServiceResponse.notFound('Doctor not found'));
      expect(mockTemplateRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository or other errors', async () => {
      mockDoctorsService.findByUserId.mockResolvedValue({
        error: null,
        data: doctor,
      });
      mockTemplateRepository.create.mockRejectedValue(new Error('DB error'));

      const service = makeService();
      const result = await service.create(templateDto, userId);

      expect(mockLogger.error).toHaveBeenCalled();
      expect(result).toEqual({
        error: { message: 'Error creating doctor timeslots' },
        data: null,
      });
    });
  });

  describe('findByDoctorId', () => {
    it('should return templates for doctor', async () => {
      const doctorId = 5;
      const templates = [{ id: 1 }, { id: 2 }] as TemplateSchedule[];
      mockTemplateRepository.findAllByDoctorId.mockResolvedValue(templates);

      const service = makeService();
      const result = await service.findByDoctorId(doctorId);

      expect(mockTemplateRepository.findAllByDoctorId).toHaveBeenCalledWith(
        doctorId,
      );
      expect(result).toEqual(ServiceResponse.success(templates));
    });
  });

  describe('findById', () => {
    it('should return template by id', async () => {
      const id = 2;
      const template = { id } as TemplateSchedule;
      mockTemplateRepository.findById.mockResolvedValue(template);

      const service = makeService();
      const result = await service.findById(id);

      expect(mockTemplateRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(ServiceResponse.success(template));
    });

    it('should return null if template not found', async () => {
      const id = 3;
      mockTemplateRepository.findById.mockResolvedValue(null);

      const service = makeService();
      const result = await service.findById(id);

      expect(result).toEqual(ServiceResponse.success(null));
    });
  });
});
