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
import { AppointmentResultDto } from './dto/appointment-result.dto';
import { AddAppointmentResultDto } from './dto/add-appointment-result.dto';
import { DeclineAppointmentDto } from './dto/decline-appointment.dto';
import {
  AppointmentsResultServiceSymbol,
  IAppointmentsResultService,
} from './appointments_result/appointments_result.service.interface';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    @Inject(AppointmentsServiceSymbol)
    private readonly appointmentsService: IAppointmentsService,
    @Inject(AppointmentsResultServiceSymbol)
    private readonly appointmentsResultService: IAppointmentsResultService,
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
  @Roles('doctor')
  @Get('patients/:patientId')
  async findByPatientId(
    @Param() { patientId }: PatientIdParamDto,
  ): Promise<AppointmentDto[]> {
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

  @ApiServiceUnavailableResponse({
    description: 'Error creating appointment result',
  })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  @Roles('doctor')
  @Post('result')
  async createResult(
    @Body() body: AddAppointmentResultDto,
    @Req() req: Request,
  ): Promise<AppointmentResultDto> {
    const user = req.user!;
    const { error: appointmentError } = await this.appointmentsService.findById(
      body.appointmentId,
    );

    const { data: isUserInAppointment } =
      await this.appointmentsService.isUserInAppointment(
        body.appointmentId,
        user.userId,
      );

    if (!isUserInAppointment?.included) {
      throw new ForbiddenException('User is not in appointment');
    }

    const appointmentsException = handleServiceError(appointmentError);
    if (appointmentsException) throw appointmentsException;

    const { error, data } = await this.appointmentsResultService.create(body);

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data)
      throw new ServiceUnavailableException(
        'Error creating appointment result',
      );

    return data;
  }
  @ApiServiceUnavailableResponse({ description: 'Error declining appointment' })
  @ApiNotFoundResponse({ description: 'Appointment not found' })
  @Post('decline')
  @Roles('doctor', 'patient')
  async declineAppointment(
    @Body() { appointmentId }: DeclineAppointmentDto,
    @Req() req: Request,
  ) {
    const user = req.user!;

    const { error, data } = await this.appointmentsService.declineAppointment(
      appointmentId,
      user.userId,
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data) throw new ServiceUnavailableException();

    return data;
  }
}
