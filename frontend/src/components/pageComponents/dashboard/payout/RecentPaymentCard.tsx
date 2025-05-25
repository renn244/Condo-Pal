import { Badge } from "@/components/ui/badge"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { CreditCardIcon } from "lucide-react"

type RecentPaymentCardProps = {
    transaction: CondoPayments_Tenant
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
                <div className={`p-2 rounded-full bg-green-100`}>
                    <CreditCardIcon className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-medium">{transaction.billingMonth}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <span>{transaction.tenant.name}</span>
                        <span className="mx-1">•</span>
                        <span>{transaction.condo.name}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-medium">{formatToPesos(transaction.totalPaid)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(new Date(transaction.payedAt))}</p>
                </div>
                <Badge>
                    Completed
                </Badge>
            </div>
        </div>
    )
}

export default RecentPaymentCard