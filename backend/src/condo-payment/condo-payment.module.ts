import { Module } from '@nestjs/common';
import { CondoPaymentController } from './condo-payment.controller';
import { CondoPaymentService } from './condo-payment.service';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { PaymongoModule } from 'src/paymongo/paymongo.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [CondoPaymentController],
  providers: [CondoPaymentService],
  imports: [FileUploadModule, PaymongoModule, NotificationModule],
  exports: [CondoPaymentService]
})
export class CondoPaymentModule {}
