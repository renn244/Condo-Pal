import BalanceSummary from "@/components/pageComponents/dashboard/payout/BalanceSummary"
import FAQ from "@/components/pageComponents/dashboard/payout/FAQ"
import PayoutHistory from "@/components/pageComponents/dashboard/payout/PayoutHistory"
import PayoutMethods from "@/components/pageComponents/dashboard/payout/PayoutMethods"
import RecentPayments from "@/components/pageComponents/dashboard/payout/RecentPayments"
import RequestPayout from "@/components/pageComponents/dashboard/payout/RequestPayout"
import { Button } from "@/components/ui/button"
import { BanknoteIcon } from "lucide-react"

const availableBalance = {
    total: 12000,
    pending: 3500,
    available: 8500,
}

const Payout = () => {

    return (
        <div className="">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Payouts</h1>
                    <p className="text-base text-muted-foreground">This is where you can get the payment from paymongo (manual and gcash goes directly to you so they are exluded)</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <BanknoteIcon className="mr-2 h-4 w-4" />
                        Add Payout Method
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <BalanceSummary 
                    total={availableBalance.total} 
                    pending={availableBalance.pending}
                    available={availableBalance.available}
                    />

                    <RecentPayments />

                    <PayoutHistory />
                </div>

                <div className="space-y-6">
                    <RequestPayout balanceAvailable={availableBalance.available} />

                    <PayoutMethods />

                    <FAQ />
                </div>
            </div>
        </div>
    )
}

export default Payout