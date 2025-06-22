import LoadingSpinner from "@/components/common/LoadingSpinner";
import NotFound from "@/components/common/NotFound";
import SomethingWentWrong from "@/components/common/SomethingWentWrong";
import PaymentReceipt from "@/components/pageComponents/tenantDashboard/PaymentReceipt";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import CondoInformationCard from "../../../components/pageComponents/tenantDashboard/CondoInformationCard";
import PaymentInstructions from "@/components/pageComponents/tenantDashboard/PaymentInstructions";
import PaymentNotAllowed from "@/components/pageComponents/tenantDashboard/PaymentNotAllowed";

const GcashPayment = () => {
    const { condoId } = useParams<{ condoId: string }>()
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

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

    function getCurrentMonth() {
        const now = new Date()
        return now.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }

    if(isLoading) return <LoadingSpinner />

    if(error) return <SomethingWentWrong reset={refetch} />

    if(!condoBillInfo) return <NotFound />

    return (
        <div className="container max-w-3xl py-8 mx-auto">
            <h1 className="text-2xl font-bold mb-6">Gcash Payment</h1>

            {isSuccess ? (
                <Alert className="mb-6 bg-green-50 border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800">Payment Submitted Successfully</AlertTitle>
                    <AlertDescription className="text-green-700">
                        {/* The march is a placeholder */}
                        Your payment for {condoBillInfo.name} ({getCurrentMonth()}) has been recorded and is pending verification from the landlord. You will receive a confirmation once it has been processed.
                    </AlertDescription>
                    <div className="mt-4">
                        <Button onClick={() => (window.location.href = "/tenant/dashboard")}>
                            Return To condoBillInfo Dashboard
                        </Button>
                    </div>
                </Alert>
            ) : (
                <>
                    <CondoInformationCard condo={condoBillInfo} />

                    {condoBillInfo.isPaymentAllowed ? (
                        <>
                            <PaymentInstructions 
                            gcashNumber={condoBillInfo.owner.billingInfo.gcashNumber}
                            ownerName={condoBillInfo.owner.name}
                            totalCost={condoBillInfo.totalCost}
                            condoId={condoBillInfo.id} 
                            />

                            <PaymentReceipt 
                            condoId={condoBillInfo.id} 
                            rentCost={condoBillInfo.rentCost} 
                            expensesCost={condoBillInfo.expensesCost}
                            maintenanceCost={condoBillInfo.maintenanceCost}

                            additionalCost={condoBillInfo.additionalCost}
                            totalPaid={condoBillInfo.totalCost}
                            setIsSuccess={setIsSuccess}
                            />
                        </>
                    ) : (
                        <PaymentNotAllowed condoName={condoBillInfo.name} dueDate={condoBillInfo.dueDate} billingMonth={condoBillInfo.billingMonth} />
                    )}
                </>
            )}
        </div>
    )
}

export default GcashPayment