import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [FileUploadModule]
})
export class UserModule {}
