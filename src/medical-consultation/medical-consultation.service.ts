import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
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
    this.rabbitClient.emit('queue.medical-consultation.requested', {
      patientId,
    });
  }

  async hasOpenConsultation(doctorId: string): Promise<boolean> {
    const openConsultation = await this.repository.findOne({
      where: { doctorId, status: MedicalConsultationStatus.OPEN },
    });

    return !!openConsultation;
  }

  private async createConsultation(
    patientId: string,
    doctorId: string,
  ): Promise<MedicalConsultation> {
    const consultation = this.repository.create({
      patientId,
      doctorId,
      status: MedicalConsultationStatus.OPEN,
    });

    return await this.repository.save(consultation);
  }

  async handleConsultationDecision(
    patientId: string,
    doctorId: string,
    accepted: boolean,
  ): Promise<MedicalConsultation | string> {
    const alreadyHasOpen = await this.hasOpenConsultation(doctorId);
    if (alreadyHasOpen) {
      throw new BadRequestException('Doctor already has an open consultation.');
    }

    if (accepted) {
      return await this.createConsultation(patientId, doctorId);
    }

    return 'Consultation was declined and not registered.';
  }

  async closeConsultation(
    id: string,
    doctorId: string,
  ): Promise<MedicalConsultation> {
    const consultation = await this.repository.findOneBy({ id, doctorId });

    if (
      !consultation ||
      consultation.status === MedicalConsultationStatus.CLOSED
    ) {
      throw new NotFoundException('Consultation not found or already closed.');
    }

    consultation.status = MedicalConsultationStatus.CLOSED;
    return await this.repository.save(consultation);
  }
}
