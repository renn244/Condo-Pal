import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { ExpenseCategory, Prisma, Recurrence } from '@prisma/client';
import { CondoService } from 'src/condo/condo.service';
import { CondoPaymentService } from 'src/condo-payment/condo-payment.service';

@Injectable()
export class ExpenseService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly condoService: CondoService,
        private readonly CondoPaymentService: CondoPaymentService,
    ) {}

    async createExpense(user: UserJwt, condoId: string, data: CreateExpenseDto) {
        const isOwner = await this.condoService.isCondoOwner(condoId, user);

        if(!isOwner) {
            throw new ForbiddenException('You do not have permission to create an expense for this condo.')
        }

        const expense = await this.prisma.expense.create({
            data: {
                ...data,
                condoId: condoId,
            }
        })

        return expense;
    }

    async getExpenses(user: UserJwt, query: {
        search: string, page: string, category: string, isRecurring: boolean, recurrence: string, condoId?: string, isPaid?: boolean
    }) {
        const take = 10;
        const skip = (parseInt(query.page || '1') - 1) * take || 0;

        const where: Prisma.ExpenseWhereInput = {
            condo: {
                ...(query.condoId ? {
                    id: query.condoId,
                    OR: [
                        { ownerId: user.id },
                        { tenantId: user.id }
                    ]
                } : {
                    OR: [
                        { ownerId: user.id },
                        { tenantId: user.id }
                    ]
                })
            },
            ...(query.search && {
                OR: [
                    { title: { contains: query.search, mode: 'insensitive' } },
                    { id: { contains: query.search, mode: 'insensitive' } }
                ]
            }),
            ...((query.category && query.category !== "ALL") && {
                category: query.category as ExpenseCategory
            }),
            ...(query.isRecurring && {
                recurring: query.isRecurring
            }),
            ...((query.recurrence && query.recurrence !== "ALL") && {
                recurrence: query.recurrence as Recurrence
            }),
            ...(query.isPaid && {
                isPaid: query.isPaid
            })
        }

        const [expenses, totalCount] = await Promise.all([
            this.prisma.expense.findMany({
                where: where,
                take: take, skip: skip,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.expense.count({ where: where })
        ])

        const hasNext = totalCount > (skip + take);
        const totalPages = Math.ceil(totalCount / take);

        return {
            expenses,
            hasNext,
            totalPages,
        }
    }

    async updateExpense(user: UserJwt, condoId: string, expenseId: string, data: UpdateExpenseDto) {
        const isOwner = await this.condoService.isCondoOwner(condoId, user);

        if(!isOwner) {
            throw new ForbiddenException('You do not have permission to create an expense for this condo.')
        }

        const expense = await this.prisma.expense.update({
            where: { id: expenseId },
            data: {
                ...data,
                condoId: condoId,
            }
        })

        return expense;
    }

    async deleteExpense(user: UserJwt, condoId: string, expenseId: string) {
        const isOwner = await this.condoService.isCondoOwner(condoId, user);

        if(!isOwner) {
            throw new ForbiddenException('You do not have permission to create an expense for this condo.')
        }

        const expense = await this.prisma.expense.delete({
            where: { id: expenseId },
        })

        return expense;
    }

    async getExpenseSummary(user: UserJwt, condoId: string) {
        const condoTenant = await this.prisma.condo.findFirst({ where: { id: condoId, tenantId: user.id }, })
        
        if(!condoTenant) {
            throw new ForbiddenException('You do not have permission to view this condo\'s expenses.')
        }

        const billingMonth = await this.CondoPaymentService.getBillingMonth(condoId, user.id);

        const [expensesThisMonth, totalExpenses, paidExpenses] = await Promise.all([
            this.CondoPaymentService.aggregateExpensesByBillingMonth(condoId, billingMonth.billingMonth),
            this.prisma.expense.aggregate({
                where: { condoId: condoId },
                _sum: { cost: true }
            }),
            this.prisma.expense.aggregate({
                where: { condoId: condoId, isPaid: true },
                _sum: { cost: true }
            })
        ])

        return {
            billingExpenses: expensesThisMonth || 0,
            totalExpenses: totalExpenses._sum.cost || 0,
            paidExpenses: paidExpenses._sum.cost || 0,
        }
    }
}
