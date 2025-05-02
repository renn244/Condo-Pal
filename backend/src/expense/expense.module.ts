import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { CondoModule } from 'src/condo/condo.module';
import { CondoPaymentModule } from 'src/condo-payment/condo-payment.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  providers: [ExpenseService],
  controllers: [ExpenseController],
  imports: [CondoModule, CondoPaymentModule, NotificationModule],
})
export class ExpenseModule {}
