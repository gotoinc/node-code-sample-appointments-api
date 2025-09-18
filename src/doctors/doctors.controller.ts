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
  Query,
  Req,
  ServiceUnavailableException,
  UsePipes,
} from '@nestjs/common';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import {
  DoctorsServiceSymbol,
  IDoctorsService,
} from './doctors.service.interface';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { Request } from 'express';
import { handleServiceError } from 'src/common/handle-service-error';
import { DoctorDto, GetDoctorQuery } from './dto/doctor.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import {
  ITemplateScheduleService,
  TemplateScheduleServiceSymbol,
} from 'src/template_schedules/template_schedules.service.interface';
import { DoctorIdParamDto } from 'src/timeslots/dto/doctor-id-param.dto';
import { TemplateSchedule } from '@prisma/client';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateTemplateScheduleDto } from 'src/template_schedules/dto/createTemplateSchedule.dto';
import { CreateDoctorsRatingDto } from './dto/create-doctor-rating.dto';
import { DoctorsRatingDto } from './dto/doctor-rating.dto';

@Auth('Jwt')
@Controller('doctors')
export class DoctorsController {
  constructor(
    @Inject(DoctorsServiceSymbol)
    private readonly doctorsService: IDoctorsService,
    @Inject(TemplateScheduleServiceSymbol)
    private readonly templateScheduleService: ITemplateScheduleService,
  ) {}

  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Error creating doctor' })
  @Roles('doctor')
  @Post()
  async create(
    @Body() body: CreateDoctorDto,
    @Req() req: Request,
  ): Promise<DoctorDto> {
    const user = req.user!;
    const { error, data } = await this.doctorsService.create(body, user.userId);
    if (error) throw new BadRequestException(error.message);
    if (!data) throw new ServiceUnavailableException('Error creating doctor');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error finding all doctors' })
  @Get()
  async findAll(
    @Query() query: GetDoctorQuery,
  ): Promise<{ data: DoctorDto[]; total: number }> {
    const { error, data } = await this.doctorsService.findAll(query);

    if (error) throw new ServiceUnavailableException(error.message);
    if (!data)
      throw new ServiceUnavailableException('Error finding all doctors');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error finding doctor' })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  @Roles('doctor')
  @Get('me')
  async findDoctorsProfileOfUser(@Req() req: Request): Promise<DoctorDto> {
    const user = req.user!;
    const { error, data } = await this.doctorsService.findByUserId(user.userId);
    if (error) throw new ServiceUnavailableException(error.message);
    if (!data) throw new NotFoundException('Doctor not found');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error finding doctor' })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  @Get(':id')
  async findOne(@Param() { id }: IdParamDto): Promise<DoctorDto> {
    const { error, data } = await this.doctorsService.findOne(id);
    if (error) throw new ServiceUnavailableException(error.message);
    if (!data) throw new NotFoundException('Doctor not found');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error updating doctor' })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  @ApiForbiddenResponse({
    description: 'Doctor profile id and user id do not match',
  })
  @ApiBadRequestResponse({ description: 'Specialization not found' })
  @Roles('doctor')
  @Put('me')
  async update(
    @Body() body: UpdateDoctorDto,
    @Req() req: Request,
  ): Promise<DoctorDto> {
    const user = req.user!;

    const { error, data } = await this.doctorsService.update(body, user.userId);

    const exception = handleServiceError(error);
    if (exception) throw exception;

    if (!data) throw new ServiceUnavailableException('Error updating doctor');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error finding template' })
  @Get(':doctorId/templates')
  async getDoctorTemplates(
    @Param() { doctorId }: DoctorIdParamDto,
  ): Promise<TemplateSchedule[]> {
    const { error, data } =
      await this.templateScheduleService.findByDoctorId(doctorId);

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data) throw new ServiceUnavailableException('Error finding templates');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error creating template' })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  @Roles('doctor')
  @Post('templates')
  @UsePipes(ZodValidationPipe)
  async createTemplateSchedule(
    @Body() body: CreateTemplateScheduleDto,
    @Req() req: Request,
  ): Promise<TemplateSchedule> {
    const user = req.user!;

    const { error, data } = await this.templateScheduleService.create(
      body,
      user.userId,
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data) throw new ServiceUnavailableException('Error creating template');

    return data;
  }

  @ApiServiceUnavailableResponse({
    description: 'Error creating doctors rating',
  })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  @Roles('patient')
  @Post('ratings')
  @ApiBody({ type: CreateDoctorsRatingDto })
  @ApiResponse({
    status: 201,
    description: 'Rating created',
    type: DoctorsRatingDto,
  })
  async createDoctorRating(
    @Body() body: CreateDoctorsRatingDto,
    @Req() req: Request,
  ): Promise<DoctorsRatingDto> {
    const user = req.user!;
    const { error, data } = await this.doctorsService.addDoctorRating(
      body,
      user.userId,
    );
    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data) throw new ServiceUnavailableException('Error creating rating');
    return data;
  }
}
