import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import PaymentsHeader from "@/components/pageComponents/dashboard/payments/PaymentsHeader"
import PaymentsPagination from "@/components/pageComponents/dashboard/payments/PaymentsPagination"
import PaymentsSummary from "@/components/pageComponents/dashboard/payments/PaymentsSummary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import usePaymentsParams from "@/hooks/usePaymentsParams"
import axiosFetch from "@/lib/axios"
import { formatBillingMonth } from "@/lib/formatBillingMonth"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpDown, ChevronDown, CreditCard, DollarSign, Smartphone, Wallet } from "lucide-react"
import toast from "react-hot-toast"

const Payments = () => {
    const { page, search, status, paymentType } = usePaymentsParams();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['getPayments', page, search, status, paymentType],
        queryFn: async () => {
            const response = await axiosFetch.get(`/condo-payment/condoPayments?page=${page}&search=${search}&status=${status}&paymentType=${paymentType}`);

            if(response.status >= 400) {
                toast.error('Something have gone wrong!')
                throw new Error();
            }

            return response.data as CondoPaymentsDashboard;
        }
    })

    const getPaymentMethod = (method: string) => {
        switch(method) {
            case "GCASH":
                return <Smartphone className="h-4 w-4 text-blue-500" />
            case "MANUAL":
                return <Wallet className="h-4 w-4" />
            case "PAYMONGO":
                return <CreditCard className="h-4 w-4 text-green-500" />
        }
    }

    if(error || (!isLoading && !data)) {
        return <SomethingWentWrong reset={refetch} />
    } 

    return (
        <div className="flex flex-col h-full">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary">
                    Payment Management
                </h1>
                <div className="flex gap-2">
                    <Button>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Add Manual Payment
                    </Button>
                </div>
            </header>

            <PaymentsSummary />

            <PaymentsHeader />
            
            {/* Payments Table */}
            <Card className="mb-6 h-[700px]">
                <CardHeader className="pb-2">
                    <CardTitle>Payments Transactions</CardTitle>
                    <CardDescription>
                        9 payments transactions found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Button variant="ghost" className="p-0 font-medium flex items-center">
                                        Date
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" className="p-0 font-medium flex items-center">
                                        Condo / Tenant
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" className="p-0 font-medium flex items-center">
                                        Type
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-right">
                                    <Button variant="ghost" className="p-0 font-medium flex items-center">
                                        Amount
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(data && data.getCondoPayments.length > 0) ? (
                                data.getCondoPayments.map((payment) =>  (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">
                                            <div>{formatDate(new Date(payment.payedAt))}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatBillingMonth(payment.billingMonth)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{payment.condo.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {payment.tenant.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getPaymentMethod(payment.type)}
                                                <span>{payment.type}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {payment.id}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatToPesos(payment.totalPaid)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8">
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No payments found matching your criteria
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <PaymentsPagination totalPages={data?.totalPages || 1} hasNext={data?.hasNext || false} />
        </div>
    )
}

export default Payments