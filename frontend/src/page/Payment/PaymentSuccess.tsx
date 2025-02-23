import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, HelpCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

type PaymentStatusResponse = {
    name: string,
    status: "pending" | "paid" | "failed" | "loading",
    linkId: string,
    checkouturl: string, // just in case the user want to go back to paying
}

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const subscriptionId = searchParams.get('subscriptionId')
    
    const { data, isFetching, refetch } = useQuery({
        queryKey: ['paymentChecking', subscriptionId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/subscription/verifyPayment?subscriptionId=${subscriptionId}`)

            if(response.status === 404) {
                return undefined
            }

            return response.data as PaymentStatusResponse
        },
        refetchOnWindowFocus: false
    })

    if(!isFetching && !data) {
        // make a component for this later
        return <div>
            not found
        </div>
    }

    const configs = {
        loading: {
            title: "Checking payment status...",
            description: "Please wait while we verify your payment",
            icon: <LoadingSpinner className="h-12 w-12 text-blue-500 animate-spin" />,
            actionLabel: "Wait",
            action: () => undefined
        },
        paid: {
            title: "Payment successful",
            description: "Thank you!, Your subscription has been processed.",
            icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
            actionLabel: "Continue",
            action: () => location.assign('/')
        },
        pending: {
            title: "Payment pending",
            description: "Have you paid already? if yes, please wait...",
            icon: <Clock className="h-12 w-12 text-yellow-500" />,
            actionLabel: "Check Again",
            action: () => refetch()
        },
        failed: {
            title: "Payment failed",
            description: "We couldn't process your payment. Please try again.",
            icon: <XCircle className="h-12 w-12 text-red-500" />,
            actionLabel: "Try Again",
            action: () => refetch()
        }
    }

    const status = configs[isFetching ? "loading" : (data?.status || "pending")];

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Payment Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                    {status.icon}

                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-semibold">
                            {status.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {status.description}
                        </p>
                    </div>

                    {/* Order Details */}
                    <PaymentDetails subscriptionId={subscriptionId || ''} checkoutSessionId={data?.linkId || ''} />

                </CardContent>
                <CardFooter className="flex-col">
                    <Button onClick={status.action} className="w-full">
                        {status.actionLabel}
                    </Button>
                    <Button variant={'outline'} className="w-full mt-2" onClick={() => location.assign(data?.checkouturl!)}>
                        Go back to payment
                    </Button>
                    <div className="mt-4">
                        <Tooltip>
                            <TooltipTrigger className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <HelpCircle className="h-4 w-4" />
                                <span>
                                    Need help? {" "}
                                    <Link className="text-blue-600 underline-offset-2 hover:underline"
                                    to={'/Support'}>
                                        Contact Support
                                    </Link>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                if you need help or you already payed but it's still not being accepted. then you can click the link to asked for help
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </CardFooter>
            </Card>            
        </div>
    )
}

const PaymentDetails = ({
    checkoutSessionId,
    subscriptionId
}: { checkoutSessionId: string, subscriptionId: string }) => {

    const { data, isLoading } = useQuery({
        queryKey: ['getInfo', checkoutSessionId],
        queryFn: async () => {
            const paymongo_url = import.meta.env.VITE_PAYMONGO_API_URL;
            const paymongo_public_secret = import.meta.env.VITE_PAYMONGO_TEST_PUBLIC;

            const response = await axios.get(`${paymongo_url}/checkout_sessions/${checkoutSessionId}`, {
                headers: {
                    Authorization: `Basic ${btoa(paymongo_public_secret)}`
                }
            });

            return response.data.data
        },
        enabled: !!checkoutSessionId, // Only run if checkoutSessionId is not empty
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const SubscriptionType = data?.attributes?.line_items?.[0].name
    const amount = data?.attributes?.line_items?.[0].amount.toString().slice(0, -2);

    return (
        <div className="w-full border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Subscription Type</span>
                {isLoading || !data ? (
                    <Skeleton className="h-6 w-10" />
                ) : (
                    <span className="font-medium">{SubscriptionType}</span>
                )}
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                {isLoading || !data ? (
                    <Skeleton className="h-6 w-22" />
                ) : (
                    <span className="font-medium">₱{amount}</span>
                )}
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subscription ID</span>
                <span className="font-medium text-sm">{subscriptionId}</span>
            </div>
        </div>
    )
}

export default PaymentSuccess