import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import useViewCondoParams from "@/hooks/useViewCondoParams"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import ExpenseTable from "../../expense/ExpenseTable"

type ExpensesTabProps = {
    condo: ViewCondoInformation
}

const ExpensesTab = ({
    condo
}: ExpensesTabProps) => {
    const { expensePage, expenseSearch, expenseCategory, expenseIsRecurring, expenseRecurrence } = useViewCondoParams();

    const { data: expenses, isLoading } = useQuery({
        queryKey: [
            'expenses', expensePage, expenseSearch, expenseCategory, 
            expenseIsRecurring, expenseRecurrence, condo.id
        ],
        queryFn: async () => {
            const response = await axiosFetch.get(
                `/expense?page=${expensePage}&search=${expenseSearch}&category=${expenseCategory || "ALL"}&isRecurring=${expenseIsRecurring}&recurrence=${expenseRecurrence || "ALL"}&condoId=${condo.id}`
            )

            return response.data as getExpensesResponse
        },
        refetchOnWindowFocus: false,
    })

    return (
        <TabsContent value="expenses" className="space-y-6">
            <ExpenseTable expenses={expenses} isLoading={isLoading} condoId={condo.id} />

            {/* Expense Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>Distribution of expense by category</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Expense breakdown chart visualization would go here
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}

export default ExpensesTab