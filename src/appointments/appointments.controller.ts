import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
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

@Controller('appointments')
export class AppointmentsController {
  constructor(
    @Inject(AppointmentsServiceSymbol)
    private readonly appointmentsService: IAppointmentsService,
  ) {}

  @Get(':id')
  async findById(@Param() { id }: IdParamDto) {
    const { error, data } = await this.appointmentsService.getById(id);

    const exception = handleServiceError(error);
    if (exception) throw exception;

    return data;
  }

  @Get('doctors/:doctorId')
  async findByDoctorId(@Param() { doctorId }: DoctorIdParamDto) {
    const { error, data } =
      await this.appointmentsService.getByDoctorId(doctorId);

    const exception = handleServiceError(error);
    if (exception) throw exception;

    return data;
  }

  @Roles('doctor')
  @Get('patients/:patientId')
  async findByPatientId(@Param() { patientId }: PatientIdParamDto) {
    const { error, data } =
      await this.appointmentsService.getByPatientId(patientId);

    const exception = handleServiceError(error);
    if (exception) throw exception;

    return data;
  }

  @Roles('patient')
  @Post()
  async create(@Body() body: CreateAppointmentDto, @Req() req: Request) {
    const user = req.user!;

    const { error, data } = await this.appointmentsService.create(
      body,
      user.userId,
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;

    return data;
  }
}
