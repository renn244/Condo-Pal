import { Module } from '@nestjs/common';
import { MaintenanceMessageService } from './maintenance-message.service';
import { MaintenanceMessageController } from './maintenance-message.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  providers: [MaintenanceMessageService],
  controllers: [MaintenanceMessageController],
  imports: [FileUploadModule]
})
export class MaintenanceMessageModule {}
