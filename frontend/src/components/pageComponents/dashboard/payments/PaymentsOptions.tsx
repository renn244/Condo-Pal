import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Download, Eye, FileCheck, MoreHorizontal } from "lucide-react"
import ViewReceipt from "./ViewReceipt"
import { Link } from "react-router-dom"
import ReceiptDownload from "@/components/common/receiptDownload/ReceiptDownload"
import { Separator } from "@/components/ui/separator"

type PaymentsOptionsProps = {
    payment: CondoPayments_Tenant,
    Icon?: React.ReactNode
}

const PaymentsOptions = ({
    payment,
    Icon=<MoreHorizontal className="h-4 w-4" />
}: PaymentsOptionsProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 w-8">
                    {Icon}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-1">
                <ViewReceipt payment={payment} />
                <Button variant="ghost" className="w-full justify-start">
                    <Eye className="mr-2 h-4 w-4" />
                    View Condo
                </Button>
                {(payment.type === "GCASH" && payment.gcashStatus !== "APPROVED") && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to={`/condoPayments/gcash/verify/${payment.id}`}>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Verify Payment
                        </Link>
                    </Button>
                )}
                <Separator className="my-1" />
                <ReceiptDownload payment={payment}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </ReceiptDownload>
            </PopoverContent>
        </Popover>
    )
}

export default PaymentsOptions