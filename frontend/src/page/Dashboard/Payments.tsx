import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { ArrowUpDown, ChevronDown, CreditCard, DollarSign, Search, Smartphone, Wallet } from "lucide-react"

// Sample data
const samplePayments = [
    {
      id: "pay-001",
      condoId: "condo-1",
      condoName: "Seaside Retreat",
      tenantId: "tenant-1",
      tenantName: "Alice Johnson",
      amount: 2750,
      paymentMethod: "GCASH",
      status: "PENDING",
      referenceNumber: "GC123456789",
      receiptUrl: "/placeholder.svg?height=600&width=400",
      createdAt: "2024-03-08T14:30:00Z",
      billMonth: "March 2024",
    },
    {
      id: "pay-002",
      condoId: "condo-2",
      condoName: "Downtown Loft",
      tenantId: "tenant-2",
      tenantName: "Bob Smith",
      amount: 3520,
      paymentMethod: "MANUAL",
      status: "APPROVED",
      referenceNumber: "MAN-2024-002",
      notes: "Cash payment received in person",
      createdAt: "2024-03-07T10:15:00Z",
      billMonth: "March 2024",
    },
    {
      id: "pay-003",
      condoId: "condo-3",
      condoName: "Mountain View",
      tenantId: "tenant-3",
      tenantName: "Jennifer Garcia",
      amount: 2800,
      paymentMethod: "PAYMONGO",
      status: "COMPLETED",
      referenceNumber: "PM-987654321",
      createdAt: "2024-03-06T16:45:00Z",
      billMonth: "March 2024",
    },
    {
      id: "pay-004",
      condoId: "condo-4",
      condoName: "Sunset Heights",
      tenantId: "tenant-4",
      tenantName: "Michael Brown",
      amount: 3500,
      paymentMethod: "GCASH",
      status: "APPROVED",
      referenceNumber: "GC987654321",
      receiptUrl: "/placeholder.svg?height=600&width=400",
      createdAt: "2024-03-05T09:20:00Z",
      billMonth: "March 2024",
    },
    {
      id: "pay-005",
      condoId: "condo-5",
      condoName: "Harbor View",
      tenantId: "tenant-5",
      tenantName: "Lisa Martinez",
      amount: 4000,
      paymentMethod: "PAYMONGO",
      status: "REJECTED",
      referenceNumber: "PM-123789456",
      notes: "Payment failed due to insufficient funds",
      createdAt: "2024-03-04T13:10:00Z",
      billMonth: "March 2024",
    },
    {
      id: "pay-006",
      condoId: "condo-1",
      condoName: "Seaside Retreat",
      tenantId: "tenant-1",
      tenantName: "Alice Johnson",
      amount: 2750,
      paymentMethod: "MANUAL",
      status: "APPROVED",
      referenceNumber: "MAN-2024-001",
      notes: "Check payment",
      createdAt: "2024-02-05T11:30:00Z",
      billMonth: "February 2024",
    },
    {
      id: "pay-007",
      condoId: "condo-2",
      condoName: "Downtown Loft",
      tenantId: "tenant-2",
      tenantName: "Bob Smith",
      amount: 3520,
      paymentMethod: "GCASH",
      status: "APPROVED",
      referenceNumber: "GC456789123",
      receiptUrl: "/placeholder.svg?height=600&width=400",
      createdAt: "2024-02-06T15:45:00Z",
      billMonth: "February 2024",
    },
    {
      id: "pay-008",
      condoId: "condo-3",
      condoName: "Mountain View",
      tenantId: "tenant-3",
      tenantName: "Jennifer Garcia",
      amount: 2800,
      paymentMethod: "PAYMONGO",
      status: "COMPLETED",
      referenceNumber: "PM-654321987",
      createdAt: "2024-02-07T09:15:00Z",
      billMonth: "February 2024",
    },
]

const Payments = () => {

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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Payments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold">8</div>
                            <div className="text-lg font-semibold">
                                {formatToPesos(25640)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold">1</div>
                            <div className="text-lg font-semibold text-yellow-500">
                                {formatToPesos(2750)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Approved
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold">6</div>
                            <div className="text-lg font-semibold text-green-500">
                                {formatToPesos(18890)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Rejected
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-2xl font-bold">1</div>
                            <div className="text-lg font-semibold text-red-500">
                                {formatToPesos(4000)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                    placeholder="Search by condo, tenant, or reference..."
                    className="pl-10"
                    />
                </div>

                <div className="flex gap-2">
                    <Select>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue className="Payment Method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">ALL Methods</SelectItem>
                            <SelectItem value="GCASH">Gcash</SelectItem>
                            <SelectItem value="MANUAL">Manual</SelectItem>
                            <SelectItem value="PAYMONGO">Paymongo</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue className="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">ALL Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue className="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Jan 2025">Jan 2025</SelectItem>
                            <SelectItem value="Feb 2025">Feb 2025</SelectItem>
                            <SelectItem value="March 2025">March 2025</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* Payments Table */}
            <Card className="mb-6">
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
                                        Method
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
                            {samplePayments.length > 0 ? (
                                samplePayments.map((payment) =>  (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">
                                            <div>{formatDate(new Date(payment.createdAt))}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {payment.billMonth}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">{payment.condoName}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {payment.tenantName}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getPaymentMethod(payment.paymentMethod)}
                                                <span>{payment.paymentMethod}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {payment.referenceNumber}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatToPesos(payment.amount)}
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

            <div className="flex justify-center mb-6">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious />
                        </PaginationItem>

                        {Array.from({ length: 5 }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default Payments