import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderModule } from './email-sender/email-sender.module';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }), EmailSenderModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
