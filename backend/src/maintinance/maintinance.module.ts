import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintinance.service';
import { MaintenanceController } from './maintinance.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { MaintenanceMessageModule } from 'src/maintenance-message/maintenance-message.module';
import { MaintenanceWorkerTokenModule } from 'src/maintenance-worker-token/maintenance-worker-token.module';

@Module({
  providers: [MaintenanceService],
  controllers: [MaintenanceController],
  imports: [FileUploadModule, MaintenanceMessageModule, MaintenanceWorkerTokenModule]
})
export class MaintenanceModule {}
