import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { ReminderController } from './reminder.controller';

@Module({
  providers: [ReminderService],
  imports: [EmailSenderModule],
  controllers: [ReminderController]
})
export class ReminderModule {}
