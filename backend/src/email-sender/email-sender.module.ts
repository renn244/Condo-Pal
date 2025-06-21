import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'email' })],
  providers: [EmailSenderService, EmailProcessor],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
