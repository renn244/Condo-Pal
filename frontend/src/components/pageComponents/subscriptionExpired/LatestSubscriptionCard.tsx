import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { useMutation } from "@tanstack/react-query"
import { CreditCard } from "lucide-react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

type LatestSubscriptionCardProps = {
    subscriptionInfo: getLatestSubscription | undefined
}

const LatestSubscriptionCard = ({
    subscriptionInfo
}: LatestSubscriptionCardProps) => {

    if(!subscriptionInfo) return null

    const { mutate, isPending } = useMutation({
        mutationKey: ['pricing', 'generatePayment'],
        mutationFn: async (type: string) => {
            const response = await axiosFetch.post('/subscription/generatePayment', {
                type: type
            }, { validateStatus: () => true })
            
            if(response.status === 401) {
                return location.assign('/login?next=/pricing')
            }

            if(response.status >= 400) throw new Error(response.data.message);
            
            return response.data
        },
        onError: (error) => {
            return toast.error(error.message)
        },
        onSuccess: (data) => {
            window.location.assign(data.attributes.checkout_url)
        }
    })

    return (
        <Card className="mb-8 border-dashed border-amber-300 bg-amber-50/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Your Current Subscription</CardTitle>
                        <CardDescription>{subscriptionInfo.type} Plan (Monthly)</CardDescription>
                    </div>
                    <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-sm font-medium">Expired</div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <div className="flex justify-between items-center pb-2 border-b border-dashed border-muted">
                        <span className="text-sm font-medium">Subscription ID</span>
                        <span className="text-sm text-muted-foreground">{subscriptionInfo.id}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-dashed border-muted">
                        <span className="text-sm font-medium">Billing Period</span>
                        <span className="text-sm text-muted-foreground">Monthly ({formatToPesos(subscriptionInfo.price)}/month)</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-dashed border-muted">
                        <span className="text-sm font-medium">Expired On</span>
                        <span className="text-sm text-red-500 font-medium">{formatDate(new Date(subscriptionInfo.expiresAt || ''))}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium">Link Id</span>
                        <span className="text-sm text-muted-foreground flex items-center">
                            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                            {subscriptionInfo.linkId}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => mutate(subscriptionInfo.type)} disabled={isPending || !subscriptionInfo.type}>
                    {isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <CreditCard className="mr-1 h-4 w-4" /> 
                            Renew Now ({formatToPesos(subscriptionInfo.price)})
                        </>
                    )}
                </Button>
                <Button variant="outline" asChild>
                    <Link to={'/pricing'}>
                        Change Plans?
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default LatestSubscriptionCard