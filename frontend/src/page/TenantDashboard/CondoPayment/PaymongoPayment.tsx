import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CreditCard } from "lucide-react";
import CondoInformationCard from "./CondoInformationCard";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SomethingWentWrong from "@/components/common/SomethingWentWrong";
import NotFound from "@/components/common/NotFound";
import axiosFetch from "@/lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";

// paymongo available payment methods
const paymentMethods = [
    {
      id: "e-wallets",
      title: "E-Wallets",
      options: [
        { id: "gcash", name: "GCash", logo: "https://cdn.prod.website-files.com/6385b55675a0bd614777a5c1/6474928322d48888f6c8cfe5_biz-gcash-logo.svg" },
        { id: "grab_pay", name: "GrabPay", logo: "https://seeklogo.com/images/G/grab-pay-logo-A0CA65B6C4-seeklogo.com.png" },
        { id: "paymaya", name: "PayMaya", logo: "https://play-lh.googleusercontent.com/fdQjxsIO8BTLaw796rQPZtLEnGEV8OJZJBJvl8dFfZLZcGf613W93z7y9dFAdDhvfqw" },
      ],
    },
    {
      id: "cards",
      title: "Credit/Debit Cards",
      options: [{ id: "card", name: "Visa/Mastercard/JCB", logo: "https://www.mastercard.com/content/dam/public/brandcenter/assets/images/logos/mclogo-for-footer.svg" }],
    },
    {
      id: "online-banking",
      title: "Online Banking",
      options: [
        { id: "bpi", name: "BPI", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Bank_of_the_Philippine_Islands_logo.svg/1200px-Bank_of_the_Philippine_Islands_logo.svg.png" },
        { id: "dob_ubp", name: "UnionBank", logo: "https://online.unionbankph.com/online-banking/4782ea777022a3b044af.png" },
        { id: "brankas_bdo", name: "BDO", logo: "https://checkout.paymongo.com/static/media/bdo.55161104.svg" },
        { id: "brankas_landbank", name: "Landbank", logo: "https://checkout.paymongo.com/static/media/landbank.6d8f6574.svg" },
        { id: "brankas_metrobank", name: "Metrobank", logo: "https://checkout.paymongo.com/static/media/metrobank.4f133ae5.svg" },
      ],
    },
    {
      id: "installments",
      title: "Installment Options",
      options: [{ id: "billease", name: "BillEase", logo: "https://checkout.paymongo.com/static/media/billease.105bc40a.png" }],
    },
]

const PaymongoPayment = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { condoId } = useParams<{ condoId: string }>()

    const { data: condoBillInfo, isLoading: condoBillInfoLoading, error, refetch } = useQuery({
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

    if(condoBillInfoLoading) return

    if(error) return <SomethingWentWrong reset={refetch} />

    if(!condoBillInfo) return <NotFound />

    const handleCreatePayment = async () => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.post(`/condo-payment/createPayment/Paymongo?condoId=${condoBillInfo.id}`)
            
            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            // redirect
            toast.success('redirect...')
            window.location.assign(response.data.attributes.checkout_url);
        } catch (error: any) {
            toast.success(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container max-w-3xl py-8 mx-auto">
            <h1 className="text-2xl font-bold mb-6">Pay with Paymongo</h1>

            <CondoInformationCard condo={condoBillInfo} />

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Available Payment Methods</CardTitle>
                    <CardDescription>
                        The following payment methods will be available on the Paymongo checkout page
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {paymentMethods.map((group) => (
                            <div key={group.id} className="space-y-3">
                                <h3 className="font-medium text-sm">{group.title}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {group.options.map((method) => (
                                        <div key={method.id} className="flex items-center gap-3 p-3 border rounded-md">
                                            <img
                                            src={method.logo || "/placeholder.svg"}
                                            alt={method.name}
                                            className="w-8 h-8 object-contain rounded-md text-sm"
                                            />
                                            <span className="text-sm">{method.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleCreatePayment()} disabled={isLoading} className="gap-2">
                        {isLoading ? <LoadingSpinner /> : "Create Payment"}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
            
            {/* Security Notice */}
            <div className="text-center text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4" />
                    Secure payments powered by Paymongo
                </p>
                <p>Your payment information is securely processed and never stored on our servers.</p>
            </div>
        </div>
    )
}

export default PaymongoPayment