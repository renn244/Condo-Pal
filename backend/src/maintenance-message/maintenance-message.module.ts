import { Module } from '@nestjs/common';
import { MaintenanceMessageService } from './maintenance-message.service';
import { MaintenanceMessageController } from './maintenance-message.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { MaintenanceMessageGateway } from './maintenance-message.gateway';

@Module({
  providers: [MaintenanceMessageService, MaintenanceMessageGateway],
  controllers: [MaintenanceMessageController],
  imports: [FileUploadModule],
})
export class MaintenanceMessageModule {}
