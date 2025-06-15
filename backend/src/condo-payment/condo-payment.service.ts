import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CondoPaymentType, GcashPaymentStatus, Prisma, Recurrence } from '@prisma/client';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserJwt } from 'src/lib/decorators/User.decorator';
import { PaymongoService } from 'src/paymongo/paymongo.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GcashPayment, GcashPaymentVerification, ManualPayment } from './dto/condo-payment.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CondoPaymentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileUploadService: FileUploadService,
        private readonly paymongoService: PaymongoService,
        private readonly notificationService: NotificationService,
    ) {}
    
    // supposed to be in expense (error: circular dependency)
    async aggregateExpensesByBillingMonth(
        condoId: string,
        targetBillingMonth: string, // Format: "MM-YYYY" (e.g., "03-2024")
        options?: {
            useFixedQuarters?: boolean;
        }
    ) {
        const [targetMonth, targetYear] = targetBillingMonth.split('-').map(Number);
        const targetDate = new Date(targetYear, targetMonth, 1);
        const QUARTERLY_BILLING_MONTHS = [3, 6, 9, 12]; // Mar, Jun, Sep, Dec

        if (targetMonth < 1 || targetMonth > 12) {
            throw new Error("Invalid billing month (MM must be 01-12)");
        }

        const expenses = await this.prisma.expense.findMany({
            where: {
                condoId,
                isPaid: false,
                OR: [
                    { billingMonth: targetBillingMonth, recurring: false },
                    { recurring: true },
                ],
            },
        });
      
        const filteredExpenses = expenses.filter((expense) => {
            if (!expense.recurring) return true;
        
            const createdMonth = expense.createdAt.getMonth() + 1;
        
            switch (expense.recurrence) {
                case Recurrence.MONTHLY:
                    return expense.createdAt <= targetDate;
        
                case Recurrence.QUARTERLY:
                    if (options?.useFixedQuarters) {
                        return QUARTERLY_BILLING_MONTHS.includes(targetMonth);
                    } else {
                        return (targetMonth - createdMonth) % 3 === 0 && targetMonth >= createdMonth;
                    }
        
                case Recurrence.YEARLY:
                    return targetMonth === createdMonth && expense.createdAt <= targetDate;
        
                default:
                    return false;
            }
        });
      
        const total = filteredExpenses.reduce((sum, expense) => sum + expense.cost, 0);
      
        return total;
    }
 
    async updateExpensesToPaid(condoId: string, billingMonth: string) {
        const [targetMonth, targetYear] = billingMonth.split('-').map(Number);
        const targetDate = new Date(targetYear, targetMonth, 1);

        const [_, expensesRecurring] = await Promise.all([
            this.prisma.expense.updateMany({
                where: {
                    condoId, isPaid: false,
                    billingMonth: billingMonth, recurring: false
                },
                data: { isPaid: true }
            }),
            this.prisma.expense.findMany({
                where: {
                    condoId, isPaid: false, recurring: true
                },
                select: {
                    id: true, createdAt: true, recurrence: true, recurring: true
                }
            })
        ])
      
        const filteredExpenses = expensesRecurring.filter((expense) => {
            if (!expense.recurring) return true;
            const createdMonth = expense.createdAt.getMonth() + 1;
        
            switch (expense.recurrence) {
                case Recurrence.MONTHLY:
                    return expense.createdAt <= targetDate;
        
                case Recurrence.QUARTERLY:
                    return (targetMonth - createdMonth) % 3 === 0 && targetMonth >= createdMonth;
        
                case Recurrence.YEARLY:
                    return targetMonth === createdMonth && expense.createdAt <= targetDate;
        
                default:
                    return false;
            }
        });

        const expensesId = filteredExpenses.map((expense) => expense.id);
        if (expensesId.length === 0) return; // no expenses to update

        await this.prisma.expense.updateMany({
            where: { id: { in: expensesId }, },
            data: { timesPaid: { increment: 1 } },
        });

        return expensesId
    }

    getBillingMonthOfDate(date: Date) {
        const month = date.getMonth() + 1; // base 1 means january is 1
        const year = date.getFullYear();

        return `${month.toString().padStart(2, '0')}-${year.toString()}`;
    }

    async getBillingMonth(condoId: string, userId: string) {
        const [latestPayment, tenantLease] = await Promise.all([
            this.prisma.condoPayment.findFirst({
                where: {
                    AND: [
                        { condoId: condoId, OR: [{ isPaid: true }, { isVerified: { not: false } }]},
                        { OR: [ { tenantId: userId }, { condo: { ownerId: userId } } ] }
                    ]
                },
                select: { billingMonth: true },
                orderBy: { payedAt: 'desc' }, // getting the most recent payment
            }),
            this.prisma.leaseAgreement.findFirst({
                where: { 
                    AND: [
                        { condoId: condoId },
                        { OR: [ { condo: { ownerId: userId } }, { tenantId: userId }, ]}
                    ],
                },
                select: { leaseStart: true, due_date: true }
            })
        ])
        
        if(!tenantLease) {
            throw new NotFoundException("Lease not found for tenant")
        }

        const leaseStartDate = new Date(tenantLease.leaseStart);
        let billingMonth: string;

        if(!latestPayment) {
            // First-time payer: Use lease start month as the first billing month
            billingMonth = this.getBillingMonthOfDate(leaseStartDate);
            const month = leaseStartDate.getMonth() + 1; 
            const year = leaseStartDate.getFullYear();
            const day = tenantLease.due_date === -1 ? new Date(year, month, 0).getDate() : tenantLease.due_date

            const dueDate = `${year}-${month.toString().padStart(2, '0')}-${day}`;

            return { billingMonth, dueDate }
        }

        const lastBillingMonth = latestPayment.billingMonth;
        const [lastMonth, lastYear] = lastBillingMonth.split('-')
        .map((data) => Number(data)) // parsing to number

        // just get the next month and if it's 13(means it's january) 
        // increase year number and back to 1 in next Month(which means it's january)
        let nextMonth = lastMonth + 1;
        let nextYear = lastYear;
        if(nextMonth > 12) { // of next year
            nextMonth = 1; 
            nextYear += 1;
        }
        const day = tenantLease.due_date === -1 ? new Date(nextYear, nextMonth, 0).getDate() : tenantLease.due_date

        // TODO LATER: should also find out if it's an advanced payment
        billingMonth = `${nextMonth.toString().padStart(2, '0')}-${nextYear.toString()}`;
        const dueDate = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${day}`; 

        return { billingMonth, dueDate };
    }

    async getTotalPayment(condoId: string, user: UserJwt) {
        const billingMonth = await this.getBillingMonth(condoId, user.id); 
        const [month, year] = billingMonth.billingMonth.split('-').map((data) => Number(data));

        const startOfMonth = new Date(year, month - 1, 1);
        
        const endOfMonth = new Date(year, month, 0); // 0 for last day of that month (dynamically)
        endOfMonth.setHours(23, 59, 59, 999);

        const [getCondoPayment, getExpensesCost, getAdditionalCost] = await Promise.all([
            this.prisma.condo.findUnique({
                where: { id: condoId },
                select: { rentAmount: true }
            }),
            this.aggregateExpensesByBillingMonth(condoId, billingMonth.billingMonth),
            this.prisma.maintenance.aggregate({
                _sum: { totalCost: true },
                where: {
                    condoId: condoId,
                    paymentResponsibility: 'TENANT',
                    completionDate: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            })
        ])

        if(!getCondoPayment) {
            throw new NotFoundException('condo not found')
        }

        return {
            // specific
            rentCost: getCondoPayment.rentAmount,
            expensesCost: getExpensesCost || 0,
            maintenanceCost: getAdditionalCost._sum.totalCost || 0,

            // summary
            additionalCost: (getAdditionalCost._sum.totalCost || 0) + (getExpensesCost || 0),
            totalCost: getCondoPayment.rentAmount + (getAdditionalCost._sum.totalCost || 0) + (getExpensesCost || 0),
            ...billingMonth,
        }
    }

    async getPaymentInformation(user: UserJwt, condoId: string) {
        // we need to know what month he or she is paying
        const [condoInfo, getBill] = await Promise.all([
            this.prisma.condo.findFirst({
                where: { AND: [
                    { id: condoId },
                    {
                        OR: [
                            { tenantId: user.id },
                            { ownerId: user.id },
                        ]
                    }
                ]},
                select: { 
                    id: true, name: true, address: true, photo: true, 
                    tenant: { select: { id: true, name: true } },
                    owner: { select: { 
                        id: true, name: true, profile: true,
                        billingInfo: { select: { gcashNumber: true } }
                    } }
                }
            }),
            this.getTotalPayment(condoId, user),
        ])
        
        if(!condoInfo) {
            throw new NotFoundException('condo not found')
        }

        return {
            ...condoInfo,
            ...getBill
        }
    }

    // GCASH PAYMENT
    async createGcashPayment(user: UserJwt, condoId: string, gcashPhoto: Express.Multer.File, body: GcashPayment) {
        const gcashUrl = (await this.fileUploadService.upload(gcashPhoto)).secure_url;
        const billingMonth = await this.getBillingMonth(condoId, user.id);

        const createPaymentGcash = await this.prisma.condoPayment.create({
            data: {
                type: CondoPaymentType.GCASH,
                rentCost: parseInt(body.rentCost),
                expensesCost: parseInt(body.expensesCost),
                maintenanceCost: parseInt(body.maintenanceCost),

                additionalCost: parseInt(body.additionalCost),
                totalPaid: parseInt(body.totalPaid),
                condoId: condoId,
                tenantId: user.id,

                receiptImage: gcashUrl,
                gcashStatus: 'PENDING',
                isVerified: false,

                billingMonth: billingMonth.billingMonth
            },
            include: { condo: { select: { ownerId: true, name: true } } }
        })

        // notify the landlord
        this.notificationService.sendNotificationToUser(createPaymentGcash.condo.ownerId, { 
            type: "PAYMENT", title: "New Gcash Payment",
            message: `Tenant ${user.name} has paid the rent for the condo "${createPaymentGcash.condo.name}". Please verify the gcash payment.`,
            link: `/dashboard/gcash/verify/${createPaymentGcash.id}`
        });

        return createPaymentGcash
    }

    async getGcashPayment(condoPaymentId: string, user: UserJwt) {
        const gcashPayment =  await this.prisma.condoPayment.findFirst({
            where: {
                id: condoPaymentId,
                condo: {
                    ownerId: user.id
                }
            },
            select: {
                id: true,
                type: true,
                rentCost: true,
                additionalCost: true,
                totalPaid: true,
                condo: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        photo: true,
                        tenant: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                receiptImage: true,
                isVerified: true,
                gcashStatus: true,

                billingMonth: true,
                payedAt: true
            }
        })

        if(!gcashPayment) throw new NotFoundException('gcashPayment not found')

        return gcashPayment
    }

    async verifyGcashPayment(user: UserJwt, condoPaymentId: string, body: GcashPaymentVerification) {
        const isVerified = body.gcashStatus === 'APPROVED';
        const isPaid = isVerified; // same thing but this is used for paymongo
        
        const updatePayment = await this.prisma.condoPayment.update({
            where: { id: condoPaymentId, condo: { ownerId: user.id } },
            data: {
                isVerified, isPaid, gcashStatus: body.gcashStatus
            },
            include: { condo: { select: { tenantId: true, name: true  } } }
        })

        // update to isPaid to the database
        await this.updateExpensesToPaid(updatePayment.condoId, updatePayment.billingMonth);

        // notify the tenant if there is any
        if(updatePayment.condo.tenantId) {
            this.notificationService.sendNotificationToUser(updatePayment.condo.tenantId, { 
                type: "PAYMENT", title: "Gcash Payment Verification",
                message: `Your Gcash payment for the condo "${updatePayment.condo.name}" has been ${body.gcashStatus.toLowerCase()}.`,
            });
        }

        return updatePayment
    }

    // MANUAL PAYMENT // only landlord are allowed
    async createManualPayment(user: UserJwt, condoId: string, body: ManualPayment) {
        const getCondo = await this.prisma.condo.findUnique({ 
            where: { id: condoId },
            select: { tenantId: true } 
        })

        if(!getCondo) throw new NotFoundException('condo not found!')

        if(!getCondo.tenantId) throw new NotFoundException('there is no tenant!')

        const billingMonth = await this.getBillingMonth(condoId, getCondo.tenantId);

        const createManualPayment = await this.prisma.condoPayment.create({
            data: {
                type: CondoPaymentType.MANUAL,
                condoId: condoId,
                rentCost: body.rentCost,
                expensesCost: body.expensesCost,
                maintenanceCost: body.maintenanceCost,
                additionalCost: body.additionalCost,
                totalPaid: body.totalPaid,
                isPaid: true,
                tenantId: getCondo.tenantId,

                billingMonth: billingMonth.billingMonth
            }, include: { condo: { select: { ownerId: true, name: true } } }
        })

        // update expense to paid
        await this.updateExpensesToPaid(condoId, createManualPayment.billingMonth);

        // notify the tenant
        this.notificationService.sendNotificationToUser(getCondo.tenantId, { 
            type: "PAYMENT", title: "Manual Payment",
            message: `The landlord has added a manual payment for the your condo "${createManualPayment.condo.name}".`,
        });

        return createManualPayment;
    }

    // PAYMONGO
    async createPaymongoPayment(tenant: UserJwt, condoId: string) {
        const getCondo = await this.prisma.condo.findUnique({
            where: {
                id: condoId,
                tenantId: tenant.id
            },
            select: { name: true, photo: true, address: true, tenant: { select : { name: true } } }
        })

        if(!getCondo) throw new NotFoundException('condo not found!');

        const totalPayment = await this.getTotalPayment(condoId, tenant);

        const createCondoPayment = await this.prisma.$transaction(async txprisma => {
            
            const condoPayment = await txprisma.condoPayment.create({
                data: {
                    type: CondoPaymentType.PAYMONGO,
                    condoId: condoId,
                    tenantId: tenant.id,
                    rentCost: totalPayment.rentCost,
                    expensesCost: totalPayment.expensesCost,
                    maintenanceCost: totalPayment.maintenanceCost,
                    additionalCost: totalPayment.additionalCost,
                    totalPaid: totalPayment.totalCost,

                    billingMonth: totalPayment.billingMonth
                }
            })

            const title = `Monthly Rent and Additional Cost Payment for the condo "${getCondo.name}"`;

            const createPaymentLink = await this.paymongoService.createCondoPayment(
                totalPayment.rentCost, totalPayment.additionalCost, title, condoPayment.id, condoId
            )

            // updating the linkId
            await txprisma.condoPayment.update({
                where: {
                    id: condoPayment.id
                },
                data: {
                    linkId: createPaymentLink.id
                }
            })

            return createPaymentLink
        })

        return createCondoPayment;
    }

    async verifyPaymongoPayment(condoPaymentId: string, user: UserJwt) {
        const getSessionId = await this.prisma.condoPayment.findUnique({
            where: {
                id: condoPaymentId
            },
            select: {
                linkId: true, // checkout_sessionId
                billingMonth: true,
                condoId: true,
                condo: { select: { ownerId: true, name: true } }
            }
        })

        if(!getSessionId || !getSessionId.linkId) throw new NotFoundException({ name: 'CondoPayment', message: 'failed to find condo payment' })
            
        const getPayment = await this.paymongoService.getPaymentLink(getSessionId.linkId)
        const status = this.paymongoService.getStatusCheckoutSession(getPayment)

        if(status !== 'paid') {
            return {
                name: "Condo Payment",
                status: status || "pending",
                linkId: getSessionId.linkId,
                checkouturl: getPayment.attributes.checkout_url
            }
        }

        // update to isPaid to the database
        await this.prisma.condoPayment.update({ where: { id: condoPaymentId }, data: { isPaid: true } })
        await this.updateExpensesToPaid(getSessionId.condoId, getSessionId.billingMonth);
        
        
        // transfer this to userpayout module later on
        const paymentAmount = getPayment.attributes.payment_intent.attributes.amount / 100;
        await this.prisma.userPayout.upsert({
            where: { userId: getSessionId.condo.ownerId },
            create: { userId: getSessionId.condo.ownerId, totalAmount: paymentAmount, availableAmount: paymentAmount },
            update: { totalAmount: { increment: paymentAmount }, availableAmount: { increment: paymentAmount } }
        })

        // notify the landlord
        this.notificationService.sendNotificationToUser(getSessionId.condo.ownerId, {
            type: "PAYMENT", title: "Paymongo Payment", link: `/dashboard/condo/${getSessionId.condoId}`,
            message: `the tenant ${user.name} has paid the rent for the condo "${getSessionId.condo.name}".`,
        })

        return {
            name: "Condo Payment",
            status: status,
            linkId: getSessionId,
            checkouturl: getPayment.attributes.checkout_url
        }
    }

    // LANDLORD DASHBOARD
    async getCondoPaymentsSummary(user: UserJwt) {
        const getCondoIds = await this.prisma.condo.findMany({
            where: { ownerId: user.id },
            select: { id: true }
        });
        const condoIds = getCondoIds.flatMap((condo) => condo.id)

        const now = new Date();
        const currMonth = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
        const prevMonth = new Date(now.setMonth(now.getMonth() - 1));
        const prevMonthFormatted = `${String(prevMonth.getMonth() + 1).padStart(2, "0")}-${prevMonth.getFullYear()}`;
        
        const [allPayments, currMonthPayments, prevMonthPayments, pendingVerifications] = await Promise.all([
            this.prisma.condoPayment.aggregate({ where: { condoId: { in: condoIds }, OR: [{ isVerified: true }, { isPaid: true }, { gcashStatus: 'APPROVED' }]}, _sum: { totalPaid: true } }),
            this.prisma.condoPayment.aggregate({ where: { condoId: { in: condoIds }, billingMonth: currMonth,  OR: [{ isVerified: true }, { isPaid: true }, { gcashStatus: 'APPROVED' }] }, _sum: { totalPaid: true } }),
            this.prisma.condoPayment.aggregate({ where: { condoId: { in: condoIds }, billingMonth: prevMonthFormatted, OR: [{ isVerified: true }, { isPaid: true }, { gcashStatus: 'APPROVED' }] }, _sum: { totalPaid: true } }),
            this.prisma.condoPayment.aggregate({ where: { condoId: { in: condoIds }, gcashStatus: "PENDING", type: 'GCASH' }, _sum: { totalPaid: true } })
        ]);

        return {
            all: allPayments._sum.totalPaid || 0,
            currentMonth: {
                total: currMonthPayments._sum.totalPaid || 0,
                month: currMonth
            },
            previousMonth: {
                total: prevMonthPayments._sum.totalPaid || 0,
                month: prevMonthFormatted,
            },
            pendingVerification: pendingVerifications._sum.totalPaid || 0,
        }
    }

    async getCondoPaymentStatistic(condoId: string) {
        const getCondoId = await this.prisma.condo.findUnique({
            where: { id: condoId },
            select: { ownerId: true }
        });

        if(!getCondoId) throw new ForbiddenException('not allowed to access this information')
        
        const [payments, landlordMaintenance] = await Promise.all([
            this.prisma.condoPayment.findMany({
                where: { condoId, OR: [{ isVerified: true }, { isPaid: true }, { gcashStatus: 'APPROVED' }] },
                select: { id: true, billingMonth: true, additionalCost: true, totalPaid: true },
            }),
            this.prisma.maintenance.findMany({
                where: { condoId, paymentResponsibility: 'LANDLORD', Status: 'COMPLETED' },
                select: { completionDate: true, totalCost: true },
            }),
        ]);
    
        // Create a Map for maintenance costs per billing month
        const maintenanceByMonth = new Map<string, number>();
        landlordMaintenance.forEach(({ completionDate, totalCost }) => {
            if (completionDate) {
                const month = this.getBillingMonthOfDate(completionDate);
                maintenanceByMonth.set(month, (maintenanceByMonth.get(month) || 0) + (totalCost || 0));
            }
        });
    
        // order the payments by payedAt
        payments.sort((a, b) => {
            const [monthA, yearA] = a.billingMonth.split('-').map(Number);
            const [monthB, yearB] = b.billingMonth.split('-').map(Number);
            return yearA - yearB || monthA - monthB; // Sort by year first, then by month
        });

        return payments.map((payment) => ({
            ...payment,
            additionalCost: (payment.additionalCost || 0) + (maintenanceByMonth.get(payment.billingMonth) || 0),
        }));
    }

    async getCondoPaymentsLandlord(user: UserJwt, query: { 
        search: string, page: string, status: string, paymentType: string, condoId: string | undefined
    }) {
        const getCondoIds = await this.prisma.condo.findMany({
            where: { ownerId: user.id },
            select: { id: true }
        });
        const condoIds = query.condoId ? [query.condoId] : getCondoIds.flatMap((condo) => condo.id)

        const page = parseInt(query.page || '1');
        const take = 10;
        const skip = (page - 1) * take;

        const where: Prisma.CondoPaymentWhereInput = {
            condoId: { in: condoIds },
            OR: [
                {
                    AND: [
                        { isPaid: true },
                        { type: { not: 'GCASH' }}
                    ]
                },
                { type: 'GCASH' }
            ],
            ...(query.search && {
                OR: [
                    {tenant: {
                        name: { 
                            contains: query.search, 
                            mode: 'insensitive'
                        },
                    }},
                    {condo: {
                        name: {
                            contains: query.search,
                            mode: 'insensitive'
                        }
                    }},
                    {id: {
                        contains: query.search,
                        mode: 'insensitive'
                    }}
                ]
            }),
            ...((query.status && query.status !== "ALL") && {
                gcashStatus: query.status as GcashPaymentStatus
            }),
            ...((query.paymentType && query.paymentType !== "ALL") && {
                type: query.paymentType as CondoPaymentType
            })
        }

        const [getCondoPayments, condoPaymentsCount] = await Promise.all([
            this.prisma.condoPayment.findMany({
                where: where,
                include: { 
                    tenant: { select: { id: true, name: true, email: true } }, 
                    condo: { select: { id: true, name: true, address: true } } 
                },
                take: take,
                skip: skip,
                orderBy: {
                    payedAt: 'desc'
                }
            }),
            this.prisma.condoPayment.count({
                where: where
            })
        ])

        const hasNext = condoPaymentsCount > (skip + take);
        const totalPages = Math.ceil(condoPaymentsCount / take); // total pages available

        return {
            getCondoPayments,
            hasNext,
            totalPages,
        };
    }

    async getFinancialStats(user: UserJwt) {
        const getCondoIds = await this.prisma.condo.findMany({
            where: { ownerId: user.id },
            select: { id: true }
        });
        const condoIds = getCondoIds.flatMap((condo) => condo.id);

        const getCurrentBillingMonth = this.getBillingMonthOfDate(new Date());
        const [currentMonth, currentYear] = getCurrentBillingMonth.split('-').map((data) => Number(data));

        // first month of the year to current month
        const billingMonths = Array.from({ length: currentMonth }, (_, i) => {
            const month = i + 1;
            const year = currentYear;

            return `${month.toString().padStart(2, '0')}-${year}`;
        }) 

        const where: Prisma.CondoPaymentWhereInput = {
            condoId: { in: condoIds }, billingMonth: { in: billingMonths },
            OR: [{ isVerified: true }, { isPaid: true }, { gcashStatus: 'APPROVED' }],
        }

        const [condoPayments, currentYearData, maintenance] = await Promise.all([
            this.prisma.condoPayment.findMany({ where: where, select: { totalPaid: true, additionalCost: true, billingMonth: true } }),
            this.prisma.condoPayment.aggregate({ where: where, _sum: { totalPaid: true, additionalCost: true } }),
            this.prisma.maintenance.findMany({
                where: { condoId: { in: condoIds }, paymentResponsibility: 'LANDLORD', Status: 'COMPLETED' },
                select: { completionDate: true, totalCost: true },
            })
        ])

        const formattedFinancialStat = condoPayments.reduce((acc, payment) => {
            const billingMonth = payment.billingMonth;

            if (!acc[billingMonth]) {
                acc[billingMonth] = { totalPaid: 0, additionalCost: 0 };
            }

            acc[billingMonth].totalPaid += payment.totalPaid || 0;
            acc[billingMonth].additionalCost += payment.additionalCost || 0;

            return acc;
        }, { } as Record<string, { totalPaid: number; additionalCost: number }>);

        // Add maintenance costs to the financial statistics
        maintenance.forEach(({ completionDate, totalCost }) => {
            if (completionDate) {
                const month = this.getBillingMonthOfDate(completionDate);
                if (!formattedFinancialStat[month]) {
                    formattedFinancialStat[month] = { totalPaid: 0, additionalCost: 0 };
                }
                formattedFinancialStat[month].additionalCost += totalCost || 0;
            }
        });

        const financialStat = Object.entries(formattedFinancialStat).map(([month, { totalPaid, additionalCost }]) => ({
            billingMonth: month, revenue: totalPaid, expenses: additionalCost 
        })).sort((a, b) => {
            const [monthA, yearA] = a.billingMonth.split('-').map(Number);
            const [monthB, yearB] = b.billingMonth.split('-').map(Number);

            if (yearA !== yearB) return yearB - yearA; // Sort by year first
            return monthB - monthA; // Then sort by month
        })

        return {
            financialStatistics: financialStat.reverse(),
            totalRevenue: currentYearData._sum.totalPaid || 0,
            totalExpenses: currentYearData._sum.additionalCost || 0,
        }
    }
}