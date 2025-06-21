import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GeneralGatewayModule } from 'src/general-gateway/general-gateway.module';
import { NotificationController } from './notification.controller';
import { BullModule } from '@nestjs/bullmq';
import { NotificationProcessor } from './notification.processor';

@Module({
  imports:[
    GeneralGatewayModule,
    BullModule.registerQueue({ name: 'notification' })
  ],
  providers: [NotificationService, NotificationProcessor],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
