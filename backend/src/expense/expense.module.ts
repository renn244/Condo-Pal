import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { CondoModule } from 'src/condo/condo.module';

@Module({
  providers: [ExpenseService],
  controllers: [ExpenseController],
  imports: [CondoModule]
})
export class ExpenseModule {}
