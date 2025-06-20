import { Controller, Post, Body, Param } from '@nestjs/common';
import { MedicalConsultationService } from './medical-consultation.service';

@Controller('medical-consultation')
export class MedicalConsultationController {
  constructor(
    private readonly consultationService: MedicalConsultationService,
  ) {}

  @Post('request')
  requestConsultation(@Body('patientId') patientId: string) {
    return this.consultationService.emitConsultationRequest(patientId);
  }

  @Post('close/:id')
  closeConsultation(
    @Param('id') id: string,
    @Body('doctorId') doctorId: string,
  ) {
    return this.consultationService.closeConsultation(id, doctorId);
  }

  @Post('process-next')
  processNextConsultation(
    @Body('doctorId') doctorId: string,
    @Body('patientId') patientId: string,
    @Body('accepted') accepted: boolean,
  ) {
    return this.consultationService.handleConsultationDecision(
      patientId,
      doctorId,
      accepted,
    );
  }
}
