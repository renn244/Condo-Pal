import LoadingSpinner from "@/components/common/LoadingSpinner";
import NotFound from "@/components/common/NotFound";
import SomethingWentWrong from "@/components/common/SomethingWentWrong";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axiosFetch from "@/lib/axios";
import formatToPesos from "@/lib/formatToPesos";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, RefreshCw, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

// Payment status configuration
const paymentStatusConfig = {
    pending: {
        title: "Payment Pending",
        description: "Your payment is being processed. This may take a few minutes.",
        icon: Clock,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
    },
    paid: {
        title: "Payment Successful",
        description: "Your payment has been successfully processed and verified.",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
    },
    failed: {
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
    },
    loading: {
        title: "Checking Payment",
        description: "we are checking the payment if it's successfull. we will notify you.",
        icon: LoadingSpinner,
        color: "text-primary",
        bgColor: "bg-muted-foreground",
        borderColor: "border-border",
    },
}

const VerifyPaymongoPayment = () => {
    const [searchParams] = useSearchParams();
    const condoId = searchParams.get('condoId') || '';
    const condoPaymentId = searchParams.get('condoPaymentId') || '';
    
    const { data: condoBillInfo, isLoading: condoBillLoading, error, refetch } = useQuery({
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

    const { data, isLoading: verifyLoading, isFetching, refetch: refetchPayment } = useQuery({
        queryKey: ['verify', 'payment'],
        queryFn: async () => {
            const response = await axiosFetch.get(`/condo-payment/verifyPayment/Paymongo?condoPaymentId=${condoPaymentId}`)

            if(response.status >= 400) {
                toast.error(response.data.message)
                return null
            }

            return response.data as PaymentStatusResponse
        },
        refetchOnWindowFocus: false
    })

    if(condoBillLoading || verifyLoading) return <LoadingSpinner />

    if(error) return <SomethingWentWrong reset={refetch} />

    if(!condoBillInfo) return <NotFound />

    // Get status config
    const statusConfig = paymentStatusConfig[data?.status || 'loading']
    const StatusIcon = statusConfig.icon

    return (
        <div className="container max-w-3xl py-8 mx-auto">
            <h1 className="text-2xl font-bold mb-6">Payment Verification</h1>

            <Card className={`mb-6 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <StatusIcon className={`h-8 w-8 ${statusConfig.color}`} />
                        <div>
                            <CardTitle>{statusConfig.title}</CardTitle>
                            <CardDescription>{statusConfig.description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {data?.status === "pending" && (
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                <p className="mb-2">
                                    Your payment is currently being processed by our payment provider.
                                    This typically takes 1-3 minutes, but may occasionally take longer during peak hours.
                                </p>
                                <p>
                                    If you've already received a confirmation from your payment provider but your payment is still showing
                                    as pending here, please wait a few more minutes for our system to sync.
                                </p>
                            </div>
                            <div className="bg-amber-100 p-3 rounded-md text-sm text-amber-800 flex items-start gap-2">
                                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">Already paid but still pending?</p>
                                    <p className="mt-1">
                                        If you've waited more than 15 minutes and your payment is still pending, please contact our support
                                        team at support@condopal.com or call (123) 456-7890 with your receipt email from paymongo
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    {data?.status === "pending" && (
                        <div className="flex justify-between items-center gap-4">
                            <Button onClick={() => refetchPayment()} disabled={isFetching} variant={'outline'} className="gap-2">
                                {
                                    isFetching ? <LoadingSpinner /> : 
                                    <>
                                        <span>Check Status Manually</span>
                                        <RefreshCw className={`h-4 w-4`} />
                                    </>
                                }
                            </Button>
                            <Button variant={'outline'} className="w-full" onClick={() => location.assign(data?.checkouturl!)}>
                                Go back to payment
                            </Button>
                        </div>
                    )}

                    {data?.status === "failed" && (
                        <div className="flex gap-3 w-full">
                            <Button variant={'outline'} onClick={() => location.assign(data?.checkouturl!)}>
                                Go back to payment
                            </Button>
                            <Button asChild>
                                <Link to={'/payment'}>Try Different Method</Link>
                            </Button>
                        </div>
                    )}

                    {data?.status === "paid" && (
                        <Button asChild>
                            <Link to="/tenant">
                                <ArrowLeft className="h-4 w-4" />
                                Return to Dashboard
                            </Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Payment Details Card */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Property</p>
                                <p className="font-medium">{condoBillInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payment Date</p>
                                <p className="font-medium">{new Date().toDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Cost</p>
                                <p className="font-medium text-primary">{formatToPesos(condoBillInfo.totalCost)}</p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm text-muted-foreground">Payment Breakdown</p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Monthly Rent</span>
                                    <span>{formatToPesos(condoBillInfo.rentCost)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Additional Cost</span>
                                    <span>{formatToPesos(condoBillInfo.additionalCost)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Help Section */}
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Need help with your payment?</AlertTitle>
                <AlertDescription>
                    If you're experiencing issues with your payment or have questions about the verification process, please
                    contact our support team at support@condopal.com or call (123) 456-7890.
                </AlertDescription>
            </Alert>
        </div>
    )
}

export default VerifyPaymongoPayment