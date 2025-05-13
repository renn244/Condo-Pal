import { Module } from '@nestjs/common';
import { LeaseAgreementService } from './lease-agreement.service';
import { LeaseAgreementController } from './lease-agreement.controller';

@Module({
  providers: [LeaseAgreementService],
  exports: [LeaseAgreementService],
  controllers: [LeaseAgreementController],
})
export class LeaseAgreementModule {}
