import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { PaymongoModule } from './paymongo/paymongo.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000, // time to live of 60 seconds
    }),
    EmailSenderModule, PaymongoModule, SubscriptionModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
