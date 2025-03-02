import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintinance.service';
import { MaintenanceController } from './maintinance.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  providers: [MaintenanceService],
  controllers: [MaintenanceController],
  imports: [FileUploadModule]
})
export class MaintenanceModule {}
