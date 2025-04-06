import { Module } from '@nestjs/common';
import { MaintenanceWorkerTokenService } from './maintenance-worker-token.service';
import { MaintenanceWorkerTokenController } from './maintenance-worker-token.controller';

@Module({
  providers: [MaintenanceWorkerTokenService],
  exports: [MaintenanceWorkerTokenService],
  controllers: [MaintenanceWorkerTokenController],
})
export class MaintenanceWorkerTokenModule {}
