import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { PaymongoModule } from './paymongo/paymongo.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CondoModule } from './condo/condo.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MaintenanceModule } from './maintinance/maintinance.module';
import { CondoPaymentModule } from './condo-payment/condo-payment.module';
import { LeaseAgreementModule } from './lease-agreement/lease-agreement.module';
import { ReminderModule } from './reminder/reminder.module';
import { MaintenanceMessageModule } from './maintenance-message/maintenance-message.module';
import { MaintenanceWorkerTokenModule } from './maintenance-worker-token/maintenance-worker-token.module';
import { MessageModule } from './message/message.module';
import { GeneralGatewayModule } from './general-gateway/general-gateway.module';
import { UserModule } from './user/user.module';
import { ExpenseModule } from './expense/expense.module';
import { NotificationModule } from './notification/notification.module';
import { ServeStaticModule  } from '@nestjs/serve-static'
import { join } from 'path';
import { PayoutModule } from './payout/payout.module';
import { PayoutMethodModule } from './payout-method/payout-method.module';

const imports = [
  AuthModule, PrismaModule, 
  ConfigModule.forRoot({
    isGlobal: true
  }),
  CacheModule.register({
    isGlobal: true,
    ttl: 60 * 1000, // time to live of 60 seconds
  }),
  EmailSenderModule, PaymongoModule, 
  SubscriptionModule, CondoModule, 
  FileUploadModule, MaintenanceModule, 
  CondoPaymentModule, LeaseAgreementModule, 
  ReminderModule, MaintenanceMessageModule,
  MaintenanceWorkerTokenModule, MessageModule, 
  GeneralGatewayModule, UserModule, ExpenseModule, 
  NotificationModule, PayoutModule, PayoutMethodModule
]

if(process.env.SOFTWARE_ENV === 'production') {
  imports.push(
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend', 'dist'),
      exclude: ['/api/reminder']
    })
  )
}

@Module({
  imports: imports,
})
export class AppModule {}
