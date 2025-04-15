import NotFound from "@/components/common/NotFound"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import useViewCondoParams from "@/hooks/useViewCondoParams"
import axiosFetch from "@/lib/axios"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { useQuery } from "@tanstack/react-query"
import { DollarSign } from "lucide-react"
import toast from "react-hot-toast"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import GetStatusBadge from "../../payments/GetStatusBadge"
import PaymentsPagination from "../../payments/PaymentsPagination"
import { formatBillingMonth } from "@/lib/formatBillingMonth"
import PaymentsOptions from "../../payments/PaymentsOptions"
import GetPaymentType from "../../payments/GetPaymentType"

const chartConfig = {
    totalPaid: {
      label: "Payments",
      color: "hsl(var(--chart-1))",
    },
    additionalCost: {
      label: "additionalCost",
      color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

type PaymentsTabProps = {
    condoId: string
}

const PaymentsTab = ({
    condoId
}: PaymentsTabProps) => {
    const { paymentPage, setPage } = useViewCondoParams();

    const { data: payments, isLoading } = useQuery({
        queryKey: ['payments', 'table', paymentPage],
        queryFn: async () => {
            const response = await axiosFetch.get(`/condo-payment/condoPayments?page=${paymentPage}&condoId=${condoId}`)
    
            if(response.status >= 400) {
                toast.error(response.data.message)
                throw new Error(response.data.message)
            }

            return response.data as CondoPaymentsDashboard
        }
    })

    const { data: condoStats } = useQuery({
        queryKey: ['payments', 'stats'],
        queryFn: async () => {
            const response = await axiosFetch.get(`/condo-payment/condoPaymentsStats?condoId=${condoId}`)

            if(response.status >= 400) {
                toast.error(response.data.message);
                return 
            }

            return response.data
        }
    })

    if(!payments && !isLoading) return <NotFound />

    if(!payments) return <NotFound />

    return (
        <TabsContent value="payments" className="space-y-6">
            <Card className="mb-6 h-[800px]">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle>Payment History</CardTitle>
                        <Button size="sm">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Record Payment
                        </Button>
                    </div>
                    <CardDescription>
                        {payments?.getCondoPayments.length} payment {payments?.getCondoPayments.length !== 1 ? "s" : " "} recorded
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[616px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Date</TableHead>
                                <TableHead>Bill Month</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(payments?.getCondoPayments && payments.getCondoPayments.length > 0) ? (
                                payments.getCondoPayments.map((payment) => (
                                    <TableRow>
                                        <TableCell className="font-medium">{formatDate(new Date(payment.payedAt))}</TableCell>
                                        <TableCell>{formatBillingMonth(payment.billingMonth)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <GetPaymentType method={payment.type} />
                                                <span>{payment.type}</span>
                                                {payment.type === "GCASH" && <GetStatusBadge status={payment.gcashStatus || "UNKNOWN"} />}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {payment.id}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{formatToPesos(payment.totalPaid)}</TableCell>
                                        <TableCell className="text-right">
                                            <PaymentsOptions payment={payment} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                        No payment records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="justify-center">
                    <PaymentsPagination page={paymentPage} setPage={(value: number) => setPage('payment', value)} 
                    totalPages={payments?.totalPages || 1} hasNext={payments?.hasNext} />
                </CardFooter>
            </Card>


            {/* Payment vs Expenses Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment vs Expenses</CardTitle>
                    <CardDescription>Monthly comparison of payments received and expenses incurred</CardDescription>
                </CardHeader>
                <CardContent>
                    {condoStats ? (
                        <ResponsiveContainer>
                            <ChartContainer config={chartConfig} className="h-[320px] w-full">
                                <AreaChart accessibilityLayer data={condoStats} margin={{ left: 12, right: 12, top: 5, bottom: 5 }} >
                                    <CartesianGrid vertical={false} />
                                    <XAxis 
                                    dataKey="billingMonth"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    />
                                    <YAxis tickFormatter={(value) => `$${value}`} />
                                    <ChartTooltip 
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent 
                                        labelFormatter={(label: any) => `BillingMonth: ${label}`}
                                        indicator="dot" />
                                    }
                                    />
                                    <Area 
                                    type="natural"
                                    dataKey="totalPaid"
                                    stackId="1"
                                    stroke="#4ade80"
                                    fill="#4ade8080"
                                    />
                                    <Area 
                                    type="natural"
                                    dataKey="additionalCost"
                                    stackId="2"
                                    stroke="#f87171"
                                    fill="#f8717180" 
                                    />
                                </AreaChart>
                            </ChartContainer>    
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            No payment or expense data available for chart visualization
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    )
}

export default PaymentsTab