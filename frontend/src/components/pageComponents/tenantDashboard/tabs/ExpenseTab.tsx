import { TabsContent } from "@/components/ui/tabs"
import { useAuthContext } from "@/context/AuthContext"
import ExpenseSummary from "../../dashboard/expense/ExpenseSummary"
import TenantExpenseTable from "../../dashboard/expense/TenantExpenseTable"

const ExpenseTab = () => {
    const { user } = useAuthContext();

    return (
        <TabsContent value="expenses" className="space-y-4">
            <ExpenseSummary condoId={user?.condo.id || ""} />

            <TenantExpenseTable />

            {/* Expense Distribution Chart */}
            {/* <Card>
                <CardHeader>
                    <CardTitle>Expense Distribution</CardTitle>
                    <CardDescription>Breakdown of expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                        <PieChart className="h-16 w-16 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">
                            Expense distribution chart would be displayed here, showing the breakdown of expenses by category.
                        </p>
                        </div>
                    </div>
                </CardContent>
            </Card> */}
        </TabsContent>
    )
}

export default ExpenseTab