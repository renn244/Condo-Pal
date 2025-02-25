import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CloudinaryProvider } from './cloudinary/cloudinary';

@Module({
  providers: [FileUploadService, CloudinaryProvider],
  exports: [CloudinaryProvider, FileUploadService]
})
export class FileUploadModule {}
