import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useViewCondoParams from "@/hooks/useViewCondoParams"
import { formatBillingMonth } from "@/lib/formatBillingMonth"
import formatToPesos from "@/lib/formatToPesos"
import { FileText, MoreHorizontal } from "lucide-react"
import AddExpense from "./AddExpense"
import DeleteExpense from "./DeleteExpense"
import EditExpense from "./EditExpense"
import ExpenseHeader from "./ExpenseHeader"
import ExpensePagination from "./ExpensePagination"

type ExpenseTableProps = {
    expenses?: getExpensesResponse,
    isLoading: boolean,
    condoId: string
}

const ExpenseTable = ({
    expenses,
    isLoading,
    condoId
}: ExpenseTableProps) => {
    const {
        expensePage, expenseSearch, expenseCategory, expenseIsRecurring, expenseRecurrence,
        setPage, setSearch, setExpenseCategory, setExpenseIsRecurring, setExpenseRecurrence 
    } = useViewCondoParams();

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle>Expense Records</CardTitle>
                    <AddExpense condoId={condoId} />
                </div>
                <CardDescription>
                    {expenses?.expenses.length || 0} expense record{expenses?.expenses.length !== 1 ? "s": ""} found
                </CardDescription>
            </CardHeader> 
            <CardContent className="h-[616px]">
                <ExpenseHeader 
                search={expenseSearch} expenseCategory={expenseCategory} expenseRecurrence={expenseRecurrence} expenseIsRecurring={expenseIsRecurring}
                setSearch={(value) => setSearch('expense', value)} setExpenseCategory={setExpenseCategory} setExpenseRecurrence={setExpenseRecurrence}
                setExpenseIsRecurring={setExpenseIsRecurring}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Billing Month</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>title</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Recurring</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <LoadingSpinner />
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses && expenses?.expenses.length > 0 ? (
                                expenses.expenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell className="font-medium">
                                            {expense.recurring ? (
                                                <Badge className="text-xs">
                                                    {expense.recurrence}
                                                </Badge>
                                            ) : (
                                                expense.billingMonth ? formatBillingMonth(expense.billingMonth) : "N/A"
                                            )}
                                            </TableCell>
                                        <TableCell>{expense.category}</TableCell>
                                        <TableCell>{expense.title}</TableCell>
                                        <TableCell className="font-medium">{formatToPesos(expense.cost)}</TableCell>
                                        <TableCell>
                                            {expense.recurring ? "Yes" : "No"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="end" className="w-56 p-1">
                                                    <EditExpense initialExpense={expense} condoId={condoId} />
                                                    <Button variant="ghost" className="w-full justify-start">
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Button>
                                                    <Separator className="my-1" />
                                                    <DeleteExpense condoId={condoId} expenseId={expense.id} />
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No expense records found
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="justify-center">
                <ExpensePagination page={expensePage} setPage={(value) => setPage('expense', value)} 
                totalPages={expenses?.totalPages || 1} hasNext={expenses?.hasNext || false} />
            </CardFooter>
        </Card>
    )
}

export default ExpenseTable