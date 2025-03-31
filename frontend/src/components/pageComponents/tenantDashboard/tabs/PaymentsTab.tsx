import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { useAuthContext } from "@/context/AuthContext"
import axiosFetch from "@/lib/axios"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import GetPaymentType from "../../dashboard/payments/GetPaymentType"
import GetStatusBadge from "../../dashboard/payments/GetStatusBadge"
import { formatBillingMonth } from "@/lib/formatBillingMonth"
import toast from "react-hot-toast"
import useTenantDashboardParams from "@/hooks/useTenantDashboardParams"
import PaymentsPagination from "../../dashboard/payments/PaymentsPagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Download, MoreHorizontal } from "lucide-react"
import ViewReceipt from "../../dashboard/payments/ViewReceipt"
import ReceiptDownload from "@/components/common/receiptDownload/ReceiptDownload"
import PaymentsHeader from "../../dashboard/payments/PaymentsHeader"
import LoadingSpinner from "@/components/common/LoadingSpinner"

//TODO LATER: REFACTOR ALL LOGIC TO INDIVIDUAL COMPONENTS
const PaymentsTab = () => {
    const { user } = useAuthContext();
    const { 
        paymentType, paymentStatus: status, paymentPage: page, paymentSearch: search,
        setPage, setSearch, setPaymentType, setPaymentStatus
    } = useTenantDashboardParams();
    const condoId = user!.condo.id;

    const { data: paymentSummary } = useQuery({
        queryKey: ["paymentSummary"],
        queryFn: async () => {
            const response = await axiosFetch.get(`/condo-payment/getBill?condoId=${condoId}`)

            return response.data as CondoBillInformation;
        },
        refetchOnWindowFocus: false,
    })

    const { data: recentPayments, isLoading } = useQuery({
        queryKey: ['recentPayments', page, search, status, paymentType, condoId],
        enabled: !!condoId,
        queryFn: async () => {
            const response = await axiosFetch.get(
                `/condo-payment/condoPayments?page=${page}&search=${search}&status=${status}&paymentType=${paymentType}&condoId=${condoId}`
            );

            if(response.status >= 400) {
                toast.error('Something have gone wrong!')
                throw new Error();
            }

            return response.data as CondoPaymentsDashboard;
        },
        refetchOnWindowFocus: false
    })

    if(!paymentSummary) return null;

    const PaymentDate = new Date(paymentSummary.dueDate);
    const today = new Date();
    // Set the hours, minutes, seconds, and milliseconds to 0 for both dates
    PaymentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    // this handle even the month of payment (1000 * 60 * 60 * 24) = 1 day
    const daysUntilNextPayment = Math.floor((PaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isLate = daysUntilNextPayment < 0;

    const isCurrentMonthPaid = () => {
        const currentBillingMonth = today.getMonth();
        const month = parseInt(paymentSummary.billingMonth.split("-")[0]);

        return currentBillingMonth < month 
    }

    return (
        <TabsContent value="payments" className="space-y-6">
            {/* Current Payment Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-muted p-4 rounded-md">
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Next Payment</h3>
                            <p className="text-2xl font-bold text-primary">{formatToPesos(paymentSummary.totalCost)}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-muted-foreground">Due Date</span>
                                <span className="font-medium">{formatDate(new Date(PaymentDate))}</span>
                            </div>
                            <div className="mt-2">
                                <div className={`text-sm text-muted-foreground ${isLate && "text-red-500 font-medium"}`}>
                                    {Math.abs(daysUntilNextPayment)} {" "}
                                    {!isLate ? "Days until payment is due" : "Days late"}
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full mt-1">
                                    <div
                                        className={`h-2 bg-primary rounded-full ${isLate ? "bg-red-500" : ""}`}
                                        style={{ width: `${Math.min(100, (30 - daysUntilNextPayment) * 3.33)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted p-4 rounded-md">
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                {isCurrentMonthPaid() ? "Next Month's Payment" : "Due Payment"}
                            </h3>
                            <div className="mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Month</span>
                                    <span className="text-sm font-medium">{formatBillingMonth(paymentSummary.billingMonth)}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-muted-foreground">Amount</span>
                                    <span className="text-sm font-medium">{formatToPesos(paymentSummary.totalCost)}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-muted-foreground">Due Date</span>
                                    <span className="text-sm font-medium">{formatDate(new Date(paymentSummary.dueDate))}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted p-4 rounded-md">
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Options</h3>
                            <div className="space-y-2 mt-3">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link to={`/condoPayments/paymongo/${condoId}`}>
                                        <img src="/paymongo.png" className="h-5 w-5 mr-1" />
                                        Paymongo
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link to={`/condoPayments/gcash/${condoId}`}>
                                        <img src="/gcash.png" className="h-5 w-5 mr-1" />
                                        Gcash (proof of payment)
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="mb-6 min-h-[700px]">
                <CardHeader className="pb-4">
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[554px]">
                    <PaymentsHeader 
                    search={search} paymentType={paymentType} status={status}
                    setSearch={(value) => setSearch('payment', value)} setPaymentType={setPaymentType} setStatus={setPaymentStatus}
                    />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Paid At</TableHead>
                                <TableHead>Billing Month</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10">
                                        <LoadingSpinner />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recentPayments?.getCondoPayments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{formatDate(new Date(payment.payedAt))}</TableCell>
                                            <TableCell className="font-medium">
                                                {formatBillingMonth(payment.billingMonth)}
                                            </TableCell>
                                            <TableCell className="font-medium">{formatToPesos(payment.totalPaid)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <GetPaymentType method={payment.type} />
                                                    <span>{payment.type}</span>
                                                    {payment.type === "GCASH" && <GetStatusBadge status={payment.gcashStatus as GcashPaymentStatus || "UNKNOWN"} />}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {payment.id}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <TenantPaymentOptions payment={payment} />
                                            </TableCell>
                                        </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="justify-center">
                    {recentPayments?.totalPages && (
                        <PaymentsPagination 
                        page={page} totalPages={recentPayments.totalPages}
                        setPage={(value) => setPage("payment", value)} hasNext={recentPayments.hasNext}
                        />
                    )}
                </CardFooter>
            </Card>
        </TabsContent>
    )
}

type TenantPaymentOptionsProps = {
    payment: CondoPayments_Tenant
}

const TenantPaymentOptions = ({
    payment
}: TenantPaymentOptionsProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-1">
                <ViewReceipt payment={payment} />
                <ReceiptDownload payment={payment}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </ReceiptDownload>
            </PopoverContent>
        </Popover>
    )
}

export default PaymentsTab