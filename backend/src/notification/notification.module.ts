import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GeneralGatewayModule } from 'src/general-gateway/general-gateway.module';
import { NotificationController } from './notification.controller';

@Module({
  providers: [NotificationService],
  imports:[GeneralGatewayModule],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
