import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { MedicalConsultation } from './entities/medical-consultation.entity';
import { MedicalConsultationService } from './medical-consultation.service';
import { MedicalConsultationController } from './medical-consultation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalConsultation]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq:5672'],
          queue: 'medical_consultation_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [MedicalConsultationController],
  providers: [MedicalConsultationService],
})
export class MedicalConsultationModule {}
