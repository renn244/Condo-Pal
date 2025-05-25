import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { Building2, IdCard, Wallet2, Wrench } from "lucide-react"

const SummaryCards = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["mainDashboard", "summary"],
        queryFn: async () => {
            const response = await axiosFetch.get("/condo/getMainDashboardSummary");

            return response.data as getMainDashboardSummary;
        }
    })

    if(isLoading) return <LoadingSpinner />

    if(!data) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Condo's</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data.totalActive}/{data.totalCondo}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        Number of occupied or active condo's
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Payment this month</CardTitle>
                    <Wallet2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data.totalPaidThisMonth}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        Number of payments received this month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Gcash Payment</CardTitle>
                    <IdCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data.pendingGcashPayment}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        Pending Gcash Payment Waiting to be verified
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data.pendingMaintenance}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        Pending Maintenance Requests Counts
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default SummaryCards