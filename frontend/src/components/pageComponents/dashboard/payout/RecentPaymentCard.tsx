import { Badge } from "@/components/ui/badge"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { CreditCardIcon } from "lucide-react"

type RecentPaymentCardProps = {
    transaction: any
}

const RecentPaymentCard = ({
    transaction
}: RecentPaymentCardProps) => {

    return (
        <div
        key={transaction.id}
        className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
        >
            <div className="flex items-center space-x-4">
                <div
                className={`p-2 rounded-full ${
                    transaction.status === "completed" ? "bg-green-100" : "bg-amber-100"
                }`}
                >
                    <CreditCardIcon className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <span>{transaction.tenant}</span>
                        <span className="mx-1">•</span>
                        <span>{transaction.property}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-medium">{formatToPesos(transaction.amount)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(new Date(transaction.date))}</p>
                </div>
                <Badge
                variant={transaction.status === "completed" ? "default" : "outline"}
                className={
                    transaction.status === "completed" ? "bg-green-500" : "text-amber-500 border-amber-500"
                }
                >
                    {transaction.status === "completed" ? "Completed" : "Pending"}
                </Badge>
            </div>
        </div>
    )
}

export default RecentPaymentCard