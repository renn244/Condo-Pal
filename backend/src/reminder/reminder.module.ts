import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { ReminderController } from './reminder.controller';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  providers: [ReminderService],
  imports: [EmailSenderModule, NotificationModule],
  controllers: [ReminderController]
})
export class ReminderModule {}
