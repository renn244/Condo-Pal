import { Module } from '@nestjs/common';
import { PayoutMethodController } from './payout-method.controller';
import { PayoutMethodService } from './payout-method.service';

@Module({
  controllers: [PayoutMethodController],
  providers: [PayoutMethodService]
})
export class PayoutMethodModule {}
