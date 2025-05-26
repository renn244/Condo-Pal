import { WalletIcon } from "lucide-react"

type PayoutMethodIconProps = {
    type: 'GRABPAY' | 'GCASH' | 'MAYA' | string
}

const PayoutMethodIcon = ({
    type
}: PayoutMethodIconProps) => {
    switch (type) {
        case 'GRABPAY':
            return <WalletIcon className="h-5 w-5 text-green-700" />
        case 'GCASH':
            return <WalletIcon className="h-5 w-5 text-blue-500" />
        case 'MAYA':
            return <WalletIcon className="h-5 w-5 text-green-400" />
    }
}

export default PayoutMethodIcon