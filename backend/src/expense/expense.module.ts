import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { CondoModule } from 'src/condo/condo.module';
import { CondoPaymentModule } from 'src/condo-payment/condo-payment.module';

@Module({
  providers: [ExpenseService],
  controllers: [ExpenseController],
  imports: [CondoModule, CondoPaymentModule],
})
export class ExpenseModule {}
