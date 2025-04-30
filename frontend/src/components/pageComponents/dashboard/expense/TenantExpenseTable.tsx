import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ExpenseHeader from './ExpenseHeader'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ExpensePagination from './ExpensePagination'
import formatToPesos from '@/lib/formatToPesos'
import formatDate from '@/lib/formatDate'
import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuthContext } from '@/context/AuthContext'
import useTenantDashboardParams from '@/hooks/useTenantDashboardParams'
import { useQuery } from '@tanstack/react-query'
import axiosFetch from '@/lib/axios'
import ViewExpense from './ViewExpense'

const TenantExpenseTable = () => {
    const { user } = useAuthContext();
    const { 
        expensePage, expenseSearch, expenseCategory, expenseIsRecurring, expenseRecurrence,
        setPage, setSearch, setExpenseCategory, setExpenseIsRecurring, setExpenseRecurrence
    } = useTenantDashboardParams();

    const { data: expenses, isLoading } = useQuery({
        queryKey: ["expenses", user?.condo.id, expensePage, expenseSearch, expenseCategory, expenseIsRecurring, expenseRecurrence],
        queryFn: async () => {
            const response = await axiosFetch.get("/expense", {
                params: {
                    condoId: user?.condo.id, page: expensePage || 1, search: expenseSearch || "",
                    category: expenseCategory, isRecurring: expenseIsRecurring, recurrence: expenseRecurrence, isPaid: false // should i include this?
                }
            });

            return response.data as getExpensesResponse;
        },
        refetchOnWindowFocus: false,
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>View and manage your expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                <ExpenseHeader  
                search={expenseSearch} expenseCategory={expenseCategory} expenseIsRecurring={expenseIsRecurring} expenseRecurrence={expenseRecurrence}
                setSearch={(value) => setSearch('expense', value)} setExpenseCategory={setExpenseCategory} setExpenseIsRecurring={setExpenseIsRecurring} setExpenseRecurrence={setExpenseRecurrence}
                />

                <div className="space-y-4">
                    {isLoading ? (
                        <div className='h-40 flex items-center justify-center'>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        expenses && expenses.expenses.length > 0 ? (
                            expenses.expenses.map((expense) => (
                                <Card key={expense.id} className={expense.isPaid ? "border-green-400" : "border-amber-200"}>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-medium">{expense.title}</h3>
                                                    <Badge variant={'outline'}>
                                                        {expense.category}
                                                    </Badge>
                                                    {expense.recurring && (
                                                        <Badge variant="outline" className="capitalize">
                                                            {expense.recurrence?.toLocaleLowerCase()}
                                                        </Badge>
                                                    )}
                                                    <Badge variant={expense.isPaid ? "default" : "destructive"}>
                                                        {expense.isPaid ? "Paid" : "Unpaid"}
                                                    </Badge>
                                                </div>
                                                {expense.notes && <p className="text-sm text-muted-foreground truncate">{expense.notes}</p>}
                                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {formatDate(new Date(expense.createdAt))}
                                                    </span>
                                                    {expense.billingMonth && <span>Billing: {expense.billingMonth}</span>}
                                                </div>
                                            </div>
                                            <div className="mt-3 md:mt-0 flex items-center space-x-4">
                                                <div className="text-lg font-semibold">{formatToPesos(expense.cost)}</div>
                                                <ViewExpense buttonVariant='outline' expense={expense} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="h-40 flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">No expenses found</p>
                            </div>
                        )
                    )}
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <ExpensePagination page={expensePage} setPage={(value) => setPage("expense", value)} 
                totalPages={expenses?.totalPages || 0} hasNext={expenses?.hasNext || false}
                />
            </CardFooter>
        </Card>
    )
}

export default TenantExpenseTable