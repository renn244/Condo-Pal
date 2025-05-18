import { BanknoteIcon, WalletIcon } from "lucide-react"

type PayoutMethodIconProps = {
    type: 'bank' | 'gcash' | 'maya' | string
}

const PayoutMethodIcon = ({
    type
}: PayoutMethodIconProps) => {
    switch (type) {
        case 'bank':
            return <BanknoteIcon className="h-5 w-5 text-primary" />
        case 'gcash':
            return <WalletIcon className="h-5 w-5 text-blue-500" />
        case 'maya':
            return <WalletIcon className="h-5 w-5 text-green-500" />
    }
}

export default PayoutMethodIcon