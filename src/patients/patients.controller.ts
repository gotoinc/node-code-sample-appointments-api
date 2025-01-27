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

@Controller('patients')
export class PatientsController {
  constructor(
    @Inject(PatientsServiceSymbol)
    private readonly patientsService: IPatientsService,
  ) {}

  @Roles('patient')
  @Post()
  async create(@Body() body: CreatePatientDto, @Req() req: Request) {
    const user = req.user!;

    const { error, data } = await this.patientsService.create(
      body,
      user.userId,
    );
    if (error) throw new BadRequestException(error.message);

    return data;
  }

  @Get()
  async findAll() {
    const { error, data } = await this.patientsService.findAll();

    if (error) throw new ServiceUnavailableException(error.message);

    return data;
  }

  @Get('me')
  async findPatientsProfileOfUser(@Req() req: Request) {
    const user = req.user!;

    const { error, data } = await this.patientsService.findByUserId(
      user.userId,
    );
    if (!data) throw new NotFoundException('Patient not found');
    if (error) throw new ServiceUnavailableException(error.message);

    return data;
  }

  @Get(':id')
  async findOne(@Param() { id }: IdParamDto) {
    const { error, data } = await this.patientsService.findById(id);
    if (!data) throw new NotFoundException('Patient not found');
    if (error) throw new ServiceUnavailableException(error.message);

    return data;
  }

  @Roles('patient')
  @Put('me')
  async update(@Body() body: UpdatePatientDto, @Req() req: Request) {
    const user = req.user!;

    const { error, data } = await this.patientsService.update(
      body,
      user.userId,
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;

    return data;
  }
}
