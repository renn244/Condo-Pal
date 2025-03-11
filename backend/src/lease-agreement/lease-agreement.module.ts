import { Module } from '@nestjs/common';
import { LeaseAgreementService } from './lease-agreement.service';

@Module({
  providers: [LeaseAgreementService],
  exports: [LeaseAgreementService],
})
export class LeaseAgreementModule {}
