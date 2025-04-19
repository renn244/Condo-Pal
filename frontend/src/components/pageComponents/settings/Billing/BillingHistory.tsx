import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axiosFetch from "@/lib/axios"
import formatDate from "@/lib/formatDate"
import { useQuery } from "@tanstack/react-query"
import { Download } from "lucide-react"
import { useState } from "react"
import PaymentsPagination from "../../dashboard/payments/PaymentsPagination"

const BillingHistory = () => {
    const [page, setPage] = useState(1);

    const { data: billingHistory, isLoading } = useQuery({
        queryKey: ['billingHistory', page],
        queryFn: async () => {
            const response = await axiosFetch(`/subscription/getBillingHistory?page=${page}`);

            return response.data as getBillingHistory
        },
    })

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Type
                                </TableHead>
                                <TableHead>
                                    Date
                                </TableHead>
                                <TableHead>
                                    ExpiredAt
                                </TableHead>
                                <TableHead className="text-right">
                                    actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        <LoadingSpinner />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (billingHistory?.billingHistory && billingHistory?.billingHistory.length !== 0) ? (
                                    billingHistory.billingHistory.map((invoice) => (
                                        <TableRow key={invoice.id} >
                                            <TableCell>
                                                {invoice.type}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(new Date(invoice.createdAt))}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(new Date(invoice.expiresAt))}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Download />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No billing history found
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-3">
                    <PaymentsPagination page={page} setPage={setPage} 
                    totalPages={billingHistory?.totalPages || 1} hasNext={billingHistory?.hasNext || false} />
                </div>
            </CardContent>
        </Card>
    )
}

export default BillingHistory