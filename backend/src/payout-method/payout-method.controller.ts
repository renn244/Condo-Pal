import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PayoutMethodService } from './payout-method.service';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { LandLordGuard } from 'src/lib/guards/LandLord.guard';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { CreatePayoutMethod, UpdatePayoutMethod } from './dto/payout-method.dto';

@Controller('payout-method')
@UseGuards(JwtAuthGuard, LandLordGuard)
export class PayoutMethodController {
    constructor(
        private readonly payoutMethodService: PayoutMethodService
    ) {}

    @Post()
    async createPayoutMethod(@User() user: UserJwt, @Body() body: CreatePayoutMethod) {
        return await this.payoutMethodService.createPayoutMethod(user, body);
    }

    @Get()
    async getPayoutMethods(@User() user: UserJwt) {
        return await this.payoutMethodService.getPayoutMethods(user);
    }

    @Get('getPayoutMethod')
    async getPayoutMethod(@User() user: UserJwt, @Query('id') id: string) {
        return await this.payoutMethodService.getPayoutMethod(user, id);
    }

    @Patch()
    async updatePayoutMethod(@User() user: UserJwt, @Query('id') id: string, @Body() body: UpdatePayoutMethod) {
        return await this.payoutMethodService.updatePayoutMethod(user, id, body);
    }

    @Delete()
    async deletePayoutMethod(@User() user: UserJwt, @Query('id') id: string) {
        return await this.payoutMethodService.deletePayoutMethod(user, id);
    }
}
