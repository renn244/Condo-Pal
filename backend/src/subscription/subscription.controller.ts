import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionTypeBody } from './dto/subscription.dto';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
    constructor(
        private readonly subscriptionService: SubscriptionService,
    ) {}

    @Post('generatePayment')
    async generatePaymentLink(@Body() body: SubscriptionTypeBody, @User() user: UserJwt) {
        return this.subscriptionService.handleSubscriptionPayment(body.type, user)
    }

    @Get('verifyPayment')
    async verifyPaymentLink(@Query('subscriptionId') subscriptionId: string, @User() user: UserJwt) {
        return this.subscriptionService.verifyPayment(subscriptionId, user)
    }

    @Get('getCurrentPlan')
    async getCurrentPlan(@User() user: UserJwt) {
        return this.subscriptionService.getCurrentPlan(user)
    }

    @Get('getBillingHistory')
    async getBillingHistory(@User() user: UserJwt, @Query() query: { page?: string }) {
        return this.subscriptionService.getBillingHistory(user, query)
    }
}