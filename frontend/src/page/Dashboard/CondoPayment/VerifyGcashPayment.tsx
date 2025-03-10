import LoadingSpinner from "@/components/common/LoadingSpinner"
import NotFound from "@/components/common/NotFound"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axios"
import formatDate from "@/lib/formatDate"
import formatDateTime from "@/lib/formatDateTime"
import formatToPesos from "@/lib/formatToPesos"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AlertTriangle, Calendar, CheckCircle2, Clock, User, XCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

type GCashStatus = "PENDING" | "APPROVED" | "REJECTED"

const VerifyGcashPayment = () => {
    const { condoPaymentId } = useParams<{ condoPaymentId: string }>();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [gcashStatus, setGcashStatus] = useState<GCashStatus>("PENDING");
    const [notes, setNotes] = useState<string>("");

    const getStatusBadge = (status: GCashStatus) => {
        switch(status) {
            case "PENDING":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                )
            case "APPROVED":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Approved
                    </Badge>
                )
            case "REJECTED":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rejected
                    </Badge>
                )
        }
    }

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['get', 'gcash'],
        queryFn: async () => {
            const response = await axiosFetch.get(`/condo-payment/getPayment/Gcash?condoPaymentId=${condoPaymentId}`);

            if(response.status === 404) {
                return null
            }

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            // replace the current gcashStatus
            setGcashStatus(response.data.gcashStatus)
                
            return response.data
        }
    })
 
    const { mutate, isPending } = useMutation({
        mutationKey: ['update', 'gcash'],
        mutationFn: async () => {
            const response = await axiosFetch.patch(`/condo-payment/verifyPayment/Gcash?condoPaymentId=${condoPaymentId}`, 
            {
                gcashStatus,
                notes
            })

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data
        },
        onSuccess: () => {
            setIsSuccess(true)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    
    if(isLoading) return <LoadingSpinner />

    if(error) return <SomethingWentWrong reset={refetch} />

    if(!data) return <NotFound />

    const initialGcashStatus = data.gcashStatus as GCashStatus;

    return (
        <div className="container max-w-3xl py-8 mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                Verify Gcash Payment
            </h1>

            {isSuccess ? (
                <Alert className={`mb-6 ${
                    gcashStatus == "APPROVED"
                        ? "bg-green-50 border-green-200"
                        : gcashStatus === "REJECTED" 
                            ? "bg-red-50 border-red-200"
                            : "bg-blue-50 border-blue-200"
                    }`}
                >
                    {gcashStatus === "APPROVED" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : gcashStatus === "REJECTED" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                        <AlertTriangle className="h-5 w-5 text-blue-600" />
                    )}
                    <AlertTitle className={`${
                        gcashStatus === "APPROVED" 
                            ? "text-green-800"
                            : gcashStatus === "REJECTED"
                                ? "text-red-800"
                                : "text-blue-800"
                    }`}>
                        Payment {gcashStatus === "APPROVED" ? "Approved" : gcashStatus === "REJECTED" ? "Rejected" : "Updated" }
                    </AlertTitle>
                    <AlertDescription className={`${
                        gcashStatus === "APPROVED"
                            ? "text-green-700"
                            : gcashStatus === "REJECTED"
                                ? "text-red-700"
                                : "text-blue-700" 
                    }`}>
                        The Gcash payment for {data.condo.name} ({"March 2025"}) has been {gcashStatus.toLocaleLowerCase()}
                        {notes && <p className="mt-2">Notes: {notes}</p>}
                    </AlertDescription>
                    <div className="mt-4">
                        <Button onClick={() => window.location.assign('/condo')}>
                            Return to Dashboard
                        </Button>
                    </div>
                </Alert>
            ) : (
                <div>
                    {/* Condo Information Card */}
                    <Card className="mb-6">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{data.condo.name}</CardTitle>
                                    <CardDescription>{data.condo.address}</CardDescription>
                                </div>
                                {getStatusBadge(initialGcashStatus)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <img 
                                src={data.condo.photo || "/placeholder.svg"}
                                alt="near Waltermart Hotel"
                                className="w-full h-48 object-cover rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Payment for: {"March 2025"}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>Tenant: {data.condo.tenant.name}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Date: {formatDate(new Date(data.payedAt))}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Monthly Rent</span>
                                    <span>{formatToPesos(data.rentCost)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Additional Fee</span>
                                    <span>{formatToPesos(data.additionalCost)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-center font-medium">
                                    <span>Total Amount Due</span>
                                    <span>{formatToPesos(data.rentCost + data.additionalCost)}</span>
                                </div>
                                <div className="flex justify-between items-center font-medium text-primary">
                                    <span>Amount Paid</span>
                                    <span className="text-lg">{formatToPesos(data.totalPaid)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* GCash Receipt Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Gcash Receipt</CardTitle>
                            <CardDescription>Review the uploaded Gcash receipt to verify the payment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center mb-4">
                                <img 
                                src={data.receiptImage}
                                alt="Gcash Receipt"
                                className="max-h-[500px] rounded-md border"
                                />
                            </div>

                            <div className="bg-muted p-4 rounded-md">
                                <h3 className="font-medium mb-2">Payment Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Amount:</p>
                                        <p className="font-medium">{formatToPesos(data.totalPaid)}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Submitted At:</p>
                                        <p className="font-medium">{formatDateTime(new Date(data.payedAt))}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Status:</p>
                                        <div>{getStatusBadge(initialGcashStatus)}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Verification Form */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Verification Decision</CardTitle>
                            <CardDescription>Approve or reject this GCash payment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="paymentstatus" className="text-base ">Payment Status</Label>
                                <RadioGroup 
                                id="paymentstatus"
                                value={gcashStatus}
                                onValueChange={(value) => setGcashStatus(value as GCashStatus)}
                                className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="PENDING" id="pending" />
                                        <Label htmlFor="pending" className="flex items-center cursor-pointer">
                                            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                            <span>Pending (Awaiting Verification)</span>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="APPROVED" id="approved" />
                                        <Label htmlFor="approved" className="flex items-center cursor-pointer">
                                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                            <span>Approved (Payment Verified)</span>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="REJECTED" id="rejected" />
                                        <Label htmlFor="rejected" className="flex items-center cursor-pointer">
                                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                            <span>Rejected (Payment Invalid)</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">
                                    Verification Notes {gcashStatus === "REJECTED" && <span className="text-red-500">*</span>}
                                </Label>
                                <Textarea id="notes"
                                placeholder={
                                    gcashStatus === "REJECTED" 
                                    ? "Please provide a reason for rejecting this payment..."
                                    : "Add any notes about this verification..."
                                }
                                className={gcashStatus === "REJECTED" && !notes ? "border-red-300" : "" + "min-h-[90px] max-h-[200px]"}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                />
                                {gcashStatus === "REJECTED" && !notes && (
                                    <p className="text-sm text-red-500">Notes are required when rejecting a payment</p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" type="button" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button 
                            onClick={() => mutate()}
                            disabled={isPending || (gcashStatus === "REJECTED" && !notes)}
                            variant={
                                gcashStatus === "APPROVED" 
                                    ? "default" 
                                    : gcashStatus === "REJECTED"
                                        ? "destructive"
                                        : "outline" 
                            }>
                                {isPending ? <LoadingSpinner /> 
                                : gcashStatus === "APPROVED" 
                                    ? "Approve Payment"
                                    : gcashStatus === "REJECTED"
                                        ? "Reject Payment"
                                        : "Save Status"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default VerifyGcashPayment