import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { CreditCard, Eye } from "lucide-react"
import GetPaymentType from "../../dashboard/payments/GetPaymentType"
import GetStatusBadge from "../../dashboard/payments/GetStatusBadge"
import { Link } from "react-router-dom"

const recentPayments = [
    {
      id: "payment-1",
      date: "2024-03-01T00:00:00Z",
      dueDate: "2024-03-01T00:00:00Z",
      amount: 2500,
      status: "PAID",
      description: "March 2024 Rent",
      receiptUrl: "/placeholder.svg?height=600&width=400",
      type: "MANUAL" as CondoPaymentType,
    },
    {
      id: "payment-2",
      date: "2024-02-01T00:00:00Z",
      dueDate: "2024-02-01T00:00:00Z",
      amount: 2500,
      status: "PAID",
      description: "February 2024 Rent",
      receiptUrl: "/placeholder.svg?height=600&width=400",
      type: "PAYMONGO" as CondoPaymentType,
    },
    {
      id: "payment-3",
      date: "2024-01-01T00:00:00Z",
      dueDate: "2024-01-01T00:00:00Z",
      amount: 2500,
      status: "PAID",
      description: "January 2024 Rent",
      receiptUrl: "/placeholder.svg?height=600&width=400",
      type: "GCASH" as CondoPaymentType,
      gcashStatus: "APPROVED",
    },
    {
      id: "payment-4",
      date: "2024-04-01T00:00:00Z",
      dueDate: "2024-04-01T00:00:00Z",
      amount: 2500,
      status: "UPCOMING",
      description: "April 2024 Rent",
      type: "GCASH" as CondoPaymentType,
      gcashStatus: "PENDING",
    },
]

const currentLease = {
    id: "lease-1",
    propertyName: "Seaside Retreat",
    propertyAddress: "123 Ocean View Dr, Miami, FL 33101",
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2024-05-31T00:00:00Z",
    monthlyRent: 2500,
    securityDeposit: 3000,
    status: "ACTIVE",
    nextPaymentDate: "2024-04-01T00:00:00Z",
    nextPaymentAmount: 2500,
    documentUrl: "#",
}

const PaymentsTab = () => {
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
                            <p className="text-2xl font-bold text-primary">{formatToPesos(currentLease.nextPaymentAmount)}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">Due Date</span>
                            <span className="font-medium">{formatDate(new Date(currentLease.nextPaymentDate))}</span>
                        </div>
                        <div className="mt-2">
                            <div className="text-sm text-muted-foreground">
                            {/* {getDaysUntilNextPayment()} days until payment is due */}
                            </div>
                                <div className="h-2 bg-gray-200 rounded-full mt-1">
                                <div
                                    className="h-2 bg-primary rounded-full"
                                    // style={{ width: `${Math.min(100, (30 - getDaysUntilNextPayment()) * 3.33)}%` }}
                                ></div>
                            </div>
                        </div>
                        </div>

                        <div className="bg-muted p-4 rounded-md">
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Methods</h3>
                            <div className="flex items-center gap-3 mt-3">
                                <CreditCard className="h-8 w-8 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Visa ending in 4242</p>
                                    <p className="text-xs text-muted-foreground">Expires 12/25</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-4">
                                Manage Payment Methods
                            </Button>
                        </div>

                        <div className="bg-muted p-4 rounded-md">
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Quick Actions</h3>
                            <div className="space-y-2 mt-3">
                                <Button className="w-full">Make a Payment</Button>
                                <Button variant="outline" className="w-full">
                                    Set Up Auto-Pay
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.description}</TableCell>
                                    <TableCell>{payment.date ? formatDate(new Date(payment.date)) : "-"}</TableCell>
                                    <TableCell>{formatDate(new Date(payment.dueDate))}</TableCell>
                                    <TableCell className="font-medium">{formatToPesos(payment.amount)}</TableCell>
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
                                        <div className="flex justify-end items-center gap-2">
                                        {payment.receiptUrl && payment.status === "PAID" && (
                                            <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 flex items-center gap-1"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="hidden sm:inline">Receipt</span>
                                            </Button>
                                        )}
                                        {payment.status === "UPCOMING" && (
                                            <Button size="sm" className="h-8 px-2">
                                                Pay Now
                                            </Button>
                                        )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                        <Link to="/tenant/payments/history">View Complete History</Link>
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}

export default PaymentsTab