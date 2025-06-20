import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MedicalConsultation,
  MedicalConsultationStatus,
} from './entities/medical-consultation.entity';

@Injectable()
export class MedicalConsultationService {
  constructor(
    @InjectRepository(MedicalConsultation)
    private readonly repository: Repository<MedicalConsultation>,

    @Inject('RABBITMQ_SERVICE')
    private readonly rabbitClient: ClientProxy,
  ) {}

  async emitConsultationRequest(patientId: string): Promise<void> {
    await this.rabbitClient.emit('queue.medical-consultation.requested', {
      patientId,
    });
  }

  async acceptConsultationRequest(
    patientId: string,
    doctorId: string,
  ): Promise<MedicalConsultation> {
    const alreadyOpen = await this.repository.findOne({
      where: { doctorId, status: MedicalConsultationStatus.OPEN },
    });

    if (alreadyOpen) {
      throw new ConflictException('You already have an open consultation.');
    }

    const consultation = this.repository.create({
      patientId,
      doctorId,
      status: MedicalConsultationStatus.OPEN,
    });

    return this.repository.save(consultation);
  }

  async closeConsultation(
    id: string,
    doctorId: string,
  ): Promise<MedicalConsultation> {
    const consultation = await this.repository.findOneBy({ id, doctorId });

    if (!consultation) {
      throw new NotFoundException('Consultation not found.');
    }

    if (consultation.status === MedicalConsultationStatus.CLOSED) {
      throw new ConflictException('Consultation already closed.');
    }

    consultation.status = MedicalConsultationStatus.CLOSED;
    return this.repository.save(consultation);
  }
}
