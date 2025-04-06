import { Module } from '@nestjs/common';
import { MaintenanceMessageService } from './maintenance-message.service';
import { MaintenanceMessageController } from './maintenance-message.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { MaintenanceMessageGateway } from './maintenance-message.gateway';
import { MaintenanceWorkerTokenModule } from 'src/maintenance-worker-token/maintenance-worker-token.module';

@Module({
  providers: [MaintenanceMessageService, MaintenanceMessageGateway],
  controllers: [MaintenanceMessageController],
  imports: [FileUploadModule, MaintenanceWorkerTokenModule],
  exports: [MaintenanceMessageService],
})
export class MaintenanceMessageModule {}
