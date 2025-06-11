import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { useQuery } from "@tanstack/react-query"
import { ArrowDownIcon, ChevronRightIcon } from "lucide-react"

const PayoutHistory = () => {
    const { data: payoutHistory } = useQuery({
        queryKey: ['payout', 'history'],
        queryFn: async () => {
            const response = await axiosFetch.get('/payout/history')

            return response.data as payoutforHistory;
        }
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Record of your previous withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {payoutHistory?.map((payout) => (
                        <div
                        key={payout.id}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <ArrowDownIcon className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Payout to {payout.payoutMethod.methodType}</p>
                                    <p className="text-xs text-muted-foreground">Ref: {payout.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-blue-600">-{formatToPesos(payout.amount)}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(new Date(payout.createdAt))}</p>
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