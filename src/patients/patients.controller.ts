import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import {
  IPatientsService,
  PatientsServiceSymbol,
} from './patients.service.interface';
import { CreatePatientDto } from './dto/create-patient.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { Request } from 'express';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { handleServiceError } from 'src/common/handle-service-error';
import { PatientDto } from './dto/patient.dto';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';

@Controller('patients')
export class PatientsController {
  constructor(
    @Inject(PatientsServiceSymbol)
    private readonly patientsService: IPatientsService,
  ) {}

  @ApiBadRequestResponse()
  @ApiServiceUnavailableResponse()
  @Roles('patient')
  @Post()
  async create(
    @Body() body: CreatePatientDto,
    @Req() req: Request,
  ): Promise<PatientDto> {
    const user = req.user!;

    const { error, data } = await this.patientsService.create(
      body,
      user.userId,
    );
    if (error) throw new BadRequestException(error.message);
    if (!data) throw new ServiceUnavailableException('Error creating patient');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error finding all patients' })
  @Get()
  async findAll(): Promise<PatientDto[]> {
    const { error, data } = await this.patientsService.findAll();

    if (error) throw new ServiceUnavailableException(error.message);
    if (!data)
      throw new ServiceUnavailableException('Error finding all patients');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error finding patient' })
  @ApiNotFoundResponse({ description: 'Patient not found' })
  @Get('me')
  async findPatientsProfileOfUser(@Req() req: Request): Promise<PatientDto> {
    const user = req.user!;

    const { error, data } = await this.patientsService.findByUserId(
      user.userId,
    );
    if (error) throw new ServiceUnavailableException(error.message);
    if (!data) throw new NotFoundException('Patient not found');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error finding patient' })
  @ApiNotFoundResponse({ description: 'Patient not found' })
  @Get(':id')
  async findOne(@Param() { id }: IdParamDto): Promise<PatientDto> {
    const { error, data } = await this.patientsService.findById(id);
    if (error) throw new ServiceUnavailableException(error.message);
    if (!data) throw new NotFoundException('Patient not found');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error updating patient' })
  @ApiNotFoundResponse({ description: 'Patient not found' })
  @ApiForbiddenResponse({
    description: 'Patient profile user id and user id do not match',
  })
  @ApiBadRequestResponse({ description: 'Specialization not found' })
  @Roles('patient')
  @Put('me')
  async update(
    @Body() body: UpdatePatientDto,
    @Req() req: Request,
  ): Promise<PatientDto> {
    const user = req.user!;

    const { error, data } = await this.patientsService.update(
      body,
      user.userId,
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;

    if (!data) throw new ServiceUnavailableException('Error updating patient');

    return data;
  }
}
