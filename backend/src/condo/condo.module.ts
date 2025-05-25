import { Module } from '@nestjs/common';
import { CondoService } from './condo.service';
import { CondoController } from './condo.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { CondoPaymentModule } from 'src/condo-payment/condo-payment.module';

@Module({
  providers: [CondoService],
  controllers: [CondoController],
  exports: [CondoService],
  imports: [FileUploadModule, CondoPaymentModule, CondoPaymentModule],
})
export class CondoModule {}
