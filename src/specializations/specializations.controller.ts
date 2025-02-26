import {
  Controller,
  Get,
  Inject,
  Param,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ISpecializationsService,
  SpecializationsServiceSymbol,
} from './specializations.service.interface';
import { IdParamDto } from 'src/common/dto/id-param.dto';

@Controller('specializations')
export class SpecializationsController {
  constructor(
    @Inject(SpecializationsServiceSymbol)
    private readonly specializationsService: ISpecializationsService,
  ) {}

  @Get()
  async findAll() {
    const { error, data } = await this.specializationsService.findAll();
    if (error) {
      throw new ServiceUnavailableException(error.message);
    }
    return data;
  }

  @Get(':id')
  async findOne(@Param() { id }: IdParamDto) {
    const { error, data } = await this.specializationsService.findOne(id);
    if (error) {
      throw new ServiceUnavailableException(error.message);
    }
    return data;
  }
}
