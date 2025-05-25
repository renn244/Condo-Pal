import { Controller, Get, UseGuards } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { LandLordGuard } from 'src/lib/guards/LandLord.guard';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';

@Controller('payout')
@UseGuards(JwtAuthGuard, LandLordGuard)
export class PayoutController {
    constructor(
        private readonly payoutService: PayoutService
    ) {}

    @Get('balance-summary')
    async getBalanceSummary(@User() user: UserJwt) {
        return this.payoutService.getBalanceSummary(user);
    }
}
