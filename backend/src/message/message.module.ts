import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { GeneralGatewayModule } from 'src/general-gateway/general-gateway.module';
import { MessageController } from './message.controller';

@Module({
  providers: [MessageService],
  imports: [FileUploadModule, GeneralGatewayModule],
  controllers: [MessageController]
})
export class MessageModule {}
