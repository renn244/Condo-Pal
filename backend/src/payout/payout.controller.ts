import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { LandLordGuard } from 'src/lib/guards/LandLord.guard';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { createPayoutDto } from './dto/payout.dto';

@Controller('payout')
@UseGuards(JwtAuthGuard, LandLordGuard)
export class PayoutController {
    constructor(
        private readonly payoutService: PayoutService
    ) {}

    @Post('requestPayout')
    async requestPayout(@User() user: UserJwt, @Body() body: createPayoutDto) {
        return this.payoutService.createPayout(user, body);
    }
    
    @Get('history')
    async getPayoutHistory(@User() user: UserJwt) {
        return this.payoutService.getPayoutHistory(user);
    }

    @Get('balance-summary')
    async getBalanceSummary(@User() user: UserJwt) {
        return this.payoutService.getBalanceSummary(user);
    }
}
