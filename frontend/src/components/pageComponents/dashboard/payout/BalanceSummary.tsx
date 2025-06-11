import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import balanceSummaryQuery from "@/hooks/useQuery/balanceSummary";
import formatToPesos from "@/lib/formatToPesos"

const BalanceSummary = () => {

    const { data, isLoading } = balanceSummaryQuery();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Balance Summary</CardTitle>
                <CardDescription>Overview of your payment balance</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Total Balance</p>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <p className="text-2xl font-bold text-primary">{formatToPesos(data?.total || 0)}</p>
                        )}
                        <p className="text-xs text-muted-foreground">All collected payments</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Withdrawn</p>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <p className="text-2xl font-bold text-amber-500">{formatToPesos(data?.withdrawn || 0)}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Withdrawn </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Available for Payout</p>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <p className="text-2xl font-bold text-green-600">{formatToPesos(data?.available || 0)}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Ready to withdraw</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BalanceSummary