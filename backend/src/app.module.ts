import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { PaymongoModule } from './paymongo/paymongo.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }), EmailSenderModule, PaymongoModule, SubscriptionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
