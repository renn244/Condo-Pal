import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios";
import { formatBillingMonth } from "@/lib/formatBillingMonth";
import formatToPesos from "@/lib/formatToPesos"
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const PaymentsSummary = () => {
    const { data: summary, isLoading } = useQuery({
        queryKey: ['getPayments', 'summary'],
        queryFn: async () => {
            const response = await axiosFetch.get("/condo-payment/condoPaymentsSummary");

            if(response.status >= 400) {
                toast.error('Something have gone wrong!')
                throw new Error();
            }
            
            return response.data as CondoPaymentsSummaryDashboard;
        }
    })

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="min-h-[134px]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Collected
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="text-2xl font-bold text-primary">
                                {formatToPesos(summary?.all || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                                All verified payments
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card className="min-h-[134px]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Current Month
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="text-2xl font-bold text-blue-500">
                                {formatToPesos(summary?.currentMonth.total || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                                {formatBillingMonth(summary?.currentMonth.month || "")}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card className="min-h-[134px]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Previous Month
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="text-2xl font-bold text-green-500">
                                {formatToPesos(summary?.previousMonth.total || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                                {formatBillingMonth(summary?.previousMonth.month || "")}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card className="min-h-[134px]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pending Verification
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className="text-2xl font-bold text-amber-500">
                                {formatToPesos(summary?.pendingVerification || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                                Awaiting approval
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentsSummary