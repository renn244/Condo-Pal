import { Body, Controller, Get, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { CondoPaymentService } from './condo-payment.service';
import { GcashPayment, GcashPaymentVerification, ManualPayment } from './dto/condo-payment.dto';

@Controller('condo-payment')
@UseGuards(JwtAuthGuard)
export class CondoPaymentController {
    constructor(
        private readonly condoPaymentService: CondoPaymentService
    ) {}

    // GCASH
    @Post('createPayment/Gcash')
    @UseInterceptors(FileInterceptor('gcashPhoto', {
        storage: multer.memoryStorage()
    }))
    async createGcashPayment(@User() user: UserJwt, @Query('condoId') condoId: string, @Body() body: GcashPayment, @UploadedFile() gcashPhoto: Express.Multer.File) {
        return this.condoPaymentService.createGcashPayment(user, condoId, gcashPhoto, body);
    }

    @Get('getPayment/Gcash')
    async getGcashPayment(@Query('condoPaymentId') condoPaymentId: string) {
        return this.condoPaymentService.getGcashPayment(condoPaymentId);
    }

    @Patch('verifyPayment/Gcash')
    async verifyGsachPayment(@User() user: UserJwt, @Query('paymentId') paymentId: string, body: GcashPaymentVerification) {
        return this.condoPaymentService.verifyGcashPayment(user, paymentId, body);
    }

    // MANUAL
    @Post('createPayment/Manual')
    async createManualPayment(@User() user: UserJwt, @Query('condoId') condoId: string, body: ManualPayment) {
        return this.condoPaymentService.createManualPayment(user, condoId, body);
    }

    // PAYMONGO
    @Post('createPayment/Paymongo')
    async createPaymongoPayment(@User() user: UserJwt, @Query('condoId') condoId: string) {
        return this.condoPaymentService.createPaymongoPayment(user, condoId)
    }

    @Get('verifyPayment/Paymongo')
    async verifyPaymongoPayment(@User() user: UserJwt, @Query('condoPaymentId') condoPaymentId: string) {
        return this.condoPaymentService.verifyPaymongoPayment(condoPaymentId, user);
    }
}
