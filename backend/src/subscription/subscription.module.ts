import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { PaymongoModule } from 'src/paymongo/paymongo.module';
import { SubscriptionController } from './subscription.controller';

@Module({
  imports: [PaymongoModule],
  providers: [SubscriptionService],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}
