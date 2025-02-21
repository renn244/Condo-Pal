import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/passport/jwt.strategy';
import { GoogleStrategy } from 'src/passport/google.strategy';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';

@Module({
  imports: [
    PassportModule, 
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' } // 30 days
      }),
      inject: [ConfigService]
    }),
    EmailSenderModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy]
})
export class AuthModule {}
