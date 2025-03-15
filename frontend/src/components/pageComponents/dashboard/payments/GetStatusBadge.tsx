import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, ShieldQuestion, XCircle } from 'lucide-react'

const GetStatusBadge = ({
    status="UNKNOWN"
}: {
    status: GcashPaymentStatus | "UNKNOWN"
}) => {
    switch(status) {
        case "PENDING":
            return (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending
                </Badge>
            )
        case "APPROVED":
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Approved
                </Badge>
            )
        case "REJECTED":
            return (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                    <XCircle className="mr-1 h-3 w-3" />
                    Rejected
                </Badge>
            )
        case "UNKNOWN":
            return (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                    <ShieldQuestion className="mr-1 h-3 w-3" />
                    Unknown
                </Badge>
            )
    }
}

export default GetStatusBadge