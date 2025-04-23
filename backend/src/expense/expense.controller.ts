import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from 'src/passport/jwt.strategy';
import { LandLordGuard } from 'src/lib/guards/LandLord.guard';
import { User, UserJwt } from 'src/lib/decorators/User.decorator';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { ExpenseCategory, Recurrence } from '@prisma/client';

@Controller('expense')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
    constructor(
        private readonly expenseService: ExpenseService,
    ) {}

    @UseGuards(LandLordGuard)
    @Post()
    async createExpense(@User() user: UserJwt, @Query('condoId') condoId: string, @Body() body: CreateExpenseDto) {
        return this.expenseService.createExpense(user, condoId, body);
    }

    @Get()
    async getExpenses(@User() user: UserJwt, @Query() query: { 
        search: string, page: string, category: ExpenseCategory, isRecurring: boolean, recurrence: Recurrence, condoId?: string
    }) {
        return this.expenseService.getExpenses(user, query);
    }

    @UseGuards(LandLordGuard)
    @Patch()
    async updateExpense(@User() user: UserJwt, @Query() query: { condoId: string, expenseId: string }, 
    @Body() body: UpdateExpenseDto) {
        return this.expenseService.updateExpense(user, query.condoId, query.expenseId, body);
    }

    @UseGuards(LandLordGuard)
    @Delete()
    async deleteRecurringExpense(@User() user: UserJwt, @Query() query: { condoId: string, expenseId: string }) {
        return this.expenseService.deleteExpense(user, query.condoId, query.expenseId);
    }
}
