import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from './entities/professional.entity';
import { CreateProfessionalDto } from './dtos/create-professional.dto';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(Professional)
    private professionalRepo: Repository<Professional>,
  ) {}

  async create(dto: CreateProfessionalDto): Promise<Professional> {
    const professional = this.professionalRepo.create(dto);
    return await this.professionalRepo.save(professional);
  }

  async findAll(): Promise<Professional[]> {
    return await this.professionalRepo.find();
  }
}
