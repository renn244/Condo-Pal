import { Controller, Get, UseGuards } from '@nestjs/common';
import { LeaseAgreementService } from './lease-agreement.service';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';

@Controller('lease-agreement')
export class LeaseAgreementController {
    constructor(
        private readonly leaseAgreementService: LeaseAgreementService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('latestEnded')
    async getLatestEndedLeaseAgreement(@User() user: UserJwt) {
        return this.leaseAgreementService.getLatestLeaseEndedAgreement(user);
    }
}
