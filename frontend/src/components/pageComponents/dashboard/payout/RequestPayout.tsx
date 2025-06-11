import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import formatToPesos from "@/lib/formatToPesos"
import { CalendarIcon, PhilippinePeso } from "lucide-react"
import PayoutMethodIcon from "./payoutMethod/PayoutMethodIcon"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import balanceSummaryQuery from "@/hooks/useQuery/balanceSummary"
import payoutMethodsQuery from "@/hooks/useQuery/payoutMethodsQuery"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosFetch from "@/lib/axios"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/common/LoadingSpinner"

const RequestPayout = () => {
    const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<string | null>(null);
    const [payoutAmount, setPayoutAmount] = useState<number>(0);

    const queryClient = useQueryClient();
    const { data: balanceSummary } = balanceSummaryQuery();
    const { data: payoutMethods } = payoutMethodsQuery();

    const { isPending: isProcessing, mutate:handlePayout } = useMutation({
        mutationKey: ['payoutRequest'],
        mutationFn: async () => {
            const response = await axiosFetch.post('/payout/requestPayout', {
                amount: payoutAmount,
                payoutMethodId: selectedPayoutMethod
            });

            if(response.status === 400) {
                toast.error(response.data.message || "Failed to request payout");
            }

            if(response.status >= 401) {
                throw new Error("Something went wrong while requesting payout!");
            }

            return response.data;
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to request payout");
        },
        onSuccess: () => {
            toast.success("Payout requested successfully!");
            setSelectedPayoutMethod(null);
            setPayoutAmount(0);

            queryClient.invalidateQueries({ queryKey: ['balanceSummary'] });
            queryClient.invalidateQueries({ queryKey: ['payout', 'history'] });
        }
    })

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
                        <PhilippinePeso className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" id="amount" placeholder="0.00" className="pl-9"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.valueAsNumber)}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Available: {formatToPesos(balanceSummary?.available || 0)}</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="payout-method">Payout Method</Label>
                    <Select 
                    value={selectedPayoutMethod || ""}
                    onValueChange={setSelectedPayoutMethod}
                    >
                        <SelectTrigger id="payout-method">
                            <SelectValue placeholder="Select payout method" />
                        </SelectTrigger>
                        <SelectContent>
                            {payoutMethods?.map((method) => (
                                <SelectItem key={method.id} value={method.id}>
                                    <div className="flex items-center">
                                        <PayoutMethodIcon type={method.methodType} />
                                        <span className="ml-2">
                                            {method.accountName} ({method.mobileNumber})
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
                onClick={() => handlePayout()}
                disabled={isProcessing || !payoutAmount || !selectedPayoutMethod || payoutAmount <= 0 || payoutAmount > (balanceSummary?.available || 0)}
                >
                    {isProcessing ? <LoadingSpinner /> : "Request Payout"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                    By requesting a payout, you agree to our terms and conditions regarding fund transfers.
                </p>
            </CardFooter>
        </Card>
    )
}

export default RequestPayout