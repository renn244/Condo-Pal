import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { ArrowDownIcon, ChevronRightIcon } from "lucide-react"

const payoutHistory = [
    {
        id: "payout_1",
        date: "2023-07-15",
        amount: 7500,
        status: "completed",
        method: "BDO Savings Account",
        reference: "PO-78901234",
    },
    {
        id: "payout_2",
        date: "2023-06-15",
        amount: 6800,
        status: "completed",
        method: "BDO Savings Account",
        reference: "PO-56781234",
    },
    {
        id: "payout_3",
        date: "2023-05-15",
        amount: 7200,
        status: "completed",
        method: "GCash",
        reference: "PO-34561234",
    }
]

const PayoutHistory = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Record of your previous withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {payoutHistory.map((payout) => (
                        <div
                        key={payout.id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <ArrowDownIcon className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Payout to {payout.method}</p>
                                    <p className="text-xs text-muted-foreground">Ref: {payout.reference}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-blue-600">-{formatToPesos(payout.amount)}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(new Date(payout.date))}</p>
                                </div>
                                <Badge className="bg-green-500">Completed</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button variant="ghost" className="w-full">
                    View All Payouts
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PayoutHistory