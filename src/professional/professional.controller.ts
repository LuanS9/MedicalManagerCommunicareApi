import { Controller, Post, Body, Get, ValidationPipe } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dtos/create-professional.dto';

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  create(@Body(ValidationPipe) dto: CreateProfessionalDto) {
    return this.professionalService.create(dto);
  }

  @Get()
  findAll() {
    return this.professionalService.findAll();
  }
}
