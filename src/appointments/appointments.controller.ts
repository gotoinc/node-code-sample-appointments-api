import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Post,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { DoctorIdParamDto } from 'src/timeslots/dto/doctor-id-param.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PatientIdParamDto } from './dto/patient-id-param.dto';
import { handleServiceError } from 'src/common/handle-service-error';
import {
  AppointmentsServiceSymbol,
  IAppointmentsService,
} from './appointments.service.interface';
import { Request } from 'express';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { AppointmentDto } from './dto/appointment.dto';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import {
  IPatientsService,
  PatientsServiceSymbol,
} from 'src/patients/patients.service.interface';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    @Inject(AppointmentsServiceSymbol)
    private readonly appointmentsService: IAppointmentsService,
    @Inject(PatientsServiceSymbol)
    private readonly patientsService: IPatientsService,
  ) {}

  @ApiServiceUnavailableResponse({ description: 'Error finding appointment' })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  @Get(':id')
  async findById(@Param() { id }: IdParamDto): Promise<AppointmentDto> {
    const { error, data } = await this.appointmentsService.findById(id);

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data)
      throw new ServiceUnavailableException('Error finding appointment');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error finding appointments' })
  @Get('doctors/:doctorId')
  async findByDoctorId(
    @Param() { doctorId }: DoctorIdParamDto,
  ): Promise<AppointmentDto[]> {
    const { error, data } =
      await this.appointmentsService.findByDoctorId(doctorId);

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data)
      throw new ServiceUnavailableException('Error finding appointment');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error finding appointments' })
  @Roles('doctor', 'patient')
  @Get('patients/:patientId')
  async findByPatientId(
    @Param() { patientId }: PatientIdParamDto,
    @Req() req: Request,
  ): Promise<AppointmentDto[]> {
    const user = req.user!;

    const { data: patient, error: patientError } =
      await this.patientsService.findByUserId(user.userId);

    if (patientError) {
      throw new ServiceUnavailableException('Error finding patient');
    }

    if (patient?.id !== patientId) {
      throw new ForbiddenException('Patient mismatch');
    }

    const { error, data } =
      await this.appointmentsService.findByPatientId(patientId);

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data)
      throw new ServiceUnavailableException('Error finding appointments');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error creating appointment' })
  @ApiNotFoundResponse({ description: 'Doctor, Patient or Timeslot not found' })
  @ApiForbiddenResponse({
    description: 'Timeslot is already taken or Doctor does not match',
  })
  @Roles('patient')
  @Post()
  async create(
    @Body() body: CreateAppointmentDto,
    @Req() req: Request,
  ): Promise<AppointmentDto> {
    const user = req.user!;

    const { error, data } = await this.appointmentsService.create(
      body,
      user.userId,
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data)
      throw new ServiceUnavailableException('Error creating appointment');

    return data;
  }
}
