import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatBillingMonth } from "@/lib/formatBillingMonth"
import formatDate from "@/lib/formatDate"
import { AlertCircle } from "lucide-react"

type PaymentNotAllowedProps = {
    condoName: string,
    dueDate: string,
    billingMonth: string
}

const PaymentNotAllowed = ({
    condoName, dueDate, billingMonth
}: PaymentNotAllowedProps) => {

    const paymentAllowedDate = new Date(new Date(dueDate).setDate(new Date(dueDate).getDate() - 7));
    const daysUntilPaymentAllowed = Math.ceil((paymentAllowedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
       <Card className="border-amber-200 bg-amber-50 mb-6">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                    <CardTitle className="text-amber-700">Payment Not Allowed Yet</CardTitle>
                </div>
                <CardDescription className="text-amber-700/70">
                    Payments for {condoName} ({formatBillingMonth(billingMonth)}) are not yet allowed. 
                    Please check back later or contact your landlord for more information.
                </CardDescription>
            </CardHeader>
            <CardContent className="bg-amber-100 rounded-lg mx-2 mb-2 p-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-center">
                        <span className="font-medium text-amber-900">Current Date:</span>
                        <div className="text-amber-800">{formatDate(new Date())}</div>
                    </div>
                    <div className="flex justify-center">
                        <span className="font-medium text-amber-900">Payment Due Date:</span>
                        <div className="text-amber-800">{formatDate(new Date(dueDate))}</div>
                    </div>
                </div>

                <div className="border-t border-amber-200 pt-3">
                    <div className="text-center">
                        <span className="font-medium text-amber-900">Payment Window Opens:</span>
                        <div className="text-amber-800 mb-2">{formatDate(paymentAllowedDate)}</div>
                    
                        <div className="bg-amber-200 rounded-md px-3 py-2 inline-block">
                            <span className="font-bold text-amber-900">
                                {daysUntilPaymentAllowed} {daysUntilPaymentAllowed === 1 ? "day" : "days"} remaining
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card> 
    )
}

export default PaymentNotAllowed