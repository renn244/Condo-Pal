import { Controller, Get, Query } from '@nestjs/common';
import { ReminderService } from './reminder.service';

@Controller('reminder')
export class ReminderController {
    constructor(
        private readonly reminderService: ReminderService
    ) {}

    @Get('wakeUp')
    async wakeUpServer() {
        return this.reminderService.wakeUpServer();
    }

    @Get('Cron-PaymentReminder')
    async runPaymentReminder(@Query('token') token: string) {
        return this.reminderService.runPaymentReminder(token);
    }
}
