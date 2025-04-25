

const ExpenseCategory = {
    UTILITY: 'UTILITY',
    ASSOCIATION: 'ASSOCIATION',
    CLEANING: 'CLEANING',
    OTHER: 'OTHER',
} as const;

type ExpenseCategory = typeof ExpenseCategory[keyof typeof ExpenseCategory];

const Recurrence = {
    MONTHLY: 'MONTHLY',
    QUERTERLY: 'QUARTERLY',
    YEARLY: 'YEARLY',
} as const;

type Recurrence = typeof Recurrence[keyof typeof Recurrence];

type expense = {
    id: string,

    condoId: string,

    title: string,
    cost: number,
    notes?: string,

    category: ExpenseCategory,
    isPaid: boolean,

    recurring: boolean,
    recurrence?: Recurrence,

    billingMonth?: string, // MM-YYYY
    createdAt: string,
    updatedAt: string,
}

type expenses = expense[];

type getExpensesResponse = {
    expenses: expenses,
    hasNext: boolean,
    totalPages: number,
}
