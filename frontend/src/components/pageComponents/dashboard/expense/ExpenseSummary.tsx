import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosFetch from "@/lib/axios";
import formatToPesos from "@/lib/formatToPesos";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Receipt, ReceiptText } from "lucide-react";

type ExpenseSummaryProps = {
    condoId: string;
}

const ExpenseSummary = ({
    condoId,
}: ExpenseSummaryProps) => {
    const { data: expenseSummary, isLoading } = useQuery({
        queryKey: ['expense', 'summary'],
        queryFn: async () => {
            const response = await axiosFetch.get(`/expense/summary?condoId=${condoId}`);

            return response.data as getExpenseSummaryResponse;
        }
    })

    const billingExpenses = expenseSummary?.billingExpenses || 0;
    const totalExpenses = expenseSummary?.totalExpenses || 0;
    const paidExpenses = expenseSummary?.paidExpenses || 0;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Bill Expenses</CardTitle>
                    <ReceiptText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="p-6 pt-0 h-[48px] flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <div className="text-2xl text-primary font-bold">{formatToPesos(billingExpenses)}</div>
                            <p className="text-xs text-muted-foreground">Current Billing Expenses</p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <Receipt className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="p-6 pt-0 h-[48px] flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <div className="text-2xl font-bold">{formatToPesos(totalExpenses)}</div>
                            <p className="text-xs text-muted-foreground">Overall expense for all your bills</p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">paid Expenses</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="p-6 pt-0 h-[48px] flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <div className="text-2xl font-bold">{formatToPesos(paidExpenses)}</div>
                            <p className="text-xs text-muted-foreground">{Math.round((paidExpenses / totalExpenses) * 100)}% of total</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ExpenseSummary