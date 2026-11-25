import { Module } from '@nestjs/common';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [EmailSenderModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
