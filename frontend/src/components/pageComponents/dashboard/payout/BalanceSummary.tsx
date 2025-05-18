import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import formatToPesos from "@/lib/formatToPesos"

type BalanceSummaryProps = {
    total: number,
    pending: number,
    available: number,
}

const BalanceSummary = ({
    total,
    pending,
    available
}: BalanceSummaryProps) => {

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
                        <p className="text-2xl font-bold text-primary">{formatToPesos(total)}</p>
                        <p className="text-xs text-muted-foreground">All collected payments</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-amber-500">{formatToPesos(pending)}</p>
                        <p className="text-xs text-muted-foreground">Processing payments</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Available for Payout</p>
                        <p className="text-2xl font-bold text-green-600">{formatToPesos(available)}</p>
                        <p className="text-xs text-muted-foreground">Ready to withdraw</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BalanceSummary