import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import formatToPesos from "@/lib/formatToPesos"
import { CalendarIcon, DollarSignIcon } from "lucide-react"
import PayoutMethodIcon from "./PayoutMethodIcon"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const payoutMethods = [
    {
        id: "pm_1",
        type: "bank",
        name: "BDO Savings Account",
        details: "•••• 4567",
        isDefault: true,
    },
    {
        id: "pm_2",
        type: "gcash",
        name: "GCash",
        details: "0917 •••• 1234",
        isDefault: false,
    },
    {
        id: "pm_3",
        type: "bank",
        name: "BPI Checking Account",
        details: "•••• 7890",
        isDefault: false,
    }
]

type RequestPayoutProps = {
    balanceAvailable: number,
}

const RequestPayout = ({
    balanceAvailable
}: RequestPayoutProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Request Payout</CardTitle>
                <CardDescription>Withdraw funds to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Payout Amount</Label>
                    <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="amount" placeholder="0.00" className="pl-9"
                    // value={payoutAmount}
                    // onChange={(e) => setPayoutAmount(e.target.value)}
                    />
                    </div>
                    <p className="text-xs text-muted-foreground">Available: {formatToPesos(balanceAvailable)}</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="payout-method">Payout Method</Label>
                    <Select 
                    // value={selectedPayoutMethod}
                    // onValueChange={setSelectedPayoutMethod}
                    >
                        <SelectTrigger id="payout-method">
                            <SelectValue placeholder="Select payout method" />
                        </SelectTrigger>
                        <SelectContent>
                            {payoutMethods.map((method) => (
                                <SelectItem key={method.id} value={method.id}>
                                    <div className="flex items-center">
                                        <PayoutMethodIcon type={method.type} />
                                        <span className="ml-2">
                                            {method.name} ({method.details}){method.isDefault && " (Default)"}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Alert>
                    <CalendarIcon className="h-4 w-4" />
                    <AlertTitle>Processing Time</AlertTitle>
                    <AlertDescription>
                        Payouts are typically processed within 1-3 business days depending on your bank.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <Button
                className="w-full"
                // onClick={handlePayout}
                // disabled={isProcessing || !payoutAmount || Number.parseFloat(payoutAmount) <= 0}
                >
                    {/* {isProcessing ? "Processing..." : "Request Payout"} */}
                    Request Payout
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                    By requesting a payout, you agree to our terms and conditions regarding fund transfers.
                </p>
            </CardFooter>
        </Card>
    )
}

export default RequestPayout