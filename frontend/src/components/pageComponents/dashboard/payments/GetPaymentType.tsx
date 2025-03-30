import { CreditCard, Smartphone, Wallet } from "lucide-react"

type GetPaymentTypeProps = {
    method: CondoPaymentType
}

const GetPaymentType = ({
    method
}: GetPaymentTypeProps) => {
    switch(method) {
        case "GCASH":
            return <Smartphone className="h-4 w-4 text-blue-500" />
        case "MANUAL":
            return <Wallet className="h-4 w-4" />
        case "PAYMONGO":
            return <CreditCard className="h-4 w-4 text-green-500" />
    }
}

export default GetPaymentType