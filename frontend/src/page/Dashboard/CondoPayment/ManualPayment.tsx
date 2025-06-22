import LoadingSpinner from "@/components/common/LoadingSpinner"
import NotFound from "@/components/common/NotFound"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import CondoInformationCard from "@/components/pageComponents/tenantDashboard/CondoInformationCard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axios"
import { useMutation, useQuery } from "@tanstack/react-query"
import { CheckCircle2, DollarSign } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

const ManualPayment = () => {
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const { condoId } = useParams<{ condoId: string }>();

    const { data: condoBillInfo, isLoading, error, refetch } = useQuery({
        queryKey: ['monthly', 'bill'],
        queryFn: async () => {
            const response = await axiosFetch.get(`/condo-payment/getBill?condoId=${condoId || ""}`)
            
            if(response.status === 404) {
                return null
            }

            if(response.status >= 400) {
                toast.error(response.data.message)
                throw new Error(response.data.message)
            }

            return response.data as CondoBillInformation
        },
        retry: false,
        refetchOnWindowFocus: false
    })

    if(isLoading) return <LoadingSpinner />

    if(error) return <SomethingWentWrong reset={refetch} />

    if(!condoBillInfo) return <NotFound />
    
    if(!condoBillInfo.tenant) {
        return (
            <div>
                error: you can't apply manual payment if there is no tenant make sure to have tenant
                if you have tenant and for downpayment make sure to create a tenant first.
            </div>
        )
    }

    return (
        <div className="container max-w-3xl py-8 mx-auto">
            <h1 className="text-2xl font-bold mb-6">Record Manual Payment</h1>

            {isSuccess ? (
                <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800">
                        Payment Recorded Successfully
                    </AlertTitle>
                    <AlertDescription className="text-green-800">
                        The payment for {condoBillInfo.name} ({"March 2025"}) has been recorded in the system.
                    </AlertDescription>
                    <div className="mt-4">
                        <Button onClick={() => window.history.back()}>
                            Return to Condo Dashboard
                        </Button>
                    </div>
                </Alert>
            ) : (
                <div>
                    <CondoInformationCard condo={condoBillInfo} />

                    <ManualPaymentRecord 
                    condoId={condoBillInfo.id} 
                    rentCost={condoBillInfo.rentCost}
                    expensesCost={condoBillInfo.expensesCost}
                    maintenanceCost={condoBillInfo.maintenanceCost}
                    additionalCost={condoBillInfo.additionalCost}
                    setIsSuccess={setIsSuccess} />
                </div>
            )}
        </div>
    )
}

type ManualPaymentRecordProps = {
    condoId: string,
    setIsSuccess: Dispatch<SetStateAction<boolean>>,
    rentCost: number,
    expensesCost: number,
    maintenanceCost: number,
    additionalCost: number
}

const ManualPaymentRecord = ({
    condoId,
    rentCost,
    expensesCost,
    maintenanceCost,
    additionalCost,
    setIsSuccess
}: ManualPaymentRecordProps) => {
    const [totalPaid, setTotalPaid] = useState<number>(0)
    const [notes, setNotes] = useState<string>("")

    const { mutate: recordPayment, isPending } = useMutation({
        mutationKey: ['manual', 'recordPayment'],
        mutationFn: async () => {
            const response = await axiosFetch.post(`/condo-payment/createPayment/Manual?condoId=${condoId}`, {
                rentCost, expensesCost, maintenanceCost,
                additionalCost,
                totalPaid,
                notes
            })
            
            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data.message
        },
        onSuccess: async () => {
            toast.success('payment successfully recorded')
            setIsSuccess(true)
        },
        onError: async (error) => {
            toast.error(error.message);
        }
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                    Record the payment details received from the tenant
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="totalPaid" className="text-base font-medium">
                        Total Amount Paid
                    </Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="totalPaid" type="number" className="pl-10 text-lg"
                        value={totalPaid} onChange={(e) => setTotalPaid(e.target.valueAsNumber)} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] max-h-[200px]"
                    placeholder="Add any additional information about the payment" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending || totalPaid <= 0} 
                onClick={() => recordPayment()} >
                    {isPending ? <LoadingSpinner /> : "Record Payment"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ManualPayment