import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintinance.service';
import { MaintenanceController } from './maintinance.controller';

@Module({
  providers: [MaintenanceService],
  controllers: [MaintenanceController]
})
export class MaintenanceModule {}
