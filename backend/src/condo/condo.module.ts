import { Module } from '@nestjs/common';
import { CondoService } from './condo.service';
import { CondoController } from './condo.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  providers: [CondoService],
  controllers: [CondoController],
  imports: [FileUploadModule],
})
export class CondoModule {}
