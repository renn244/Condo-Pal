import NotFound from "@/components/common/NotFound";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusBadgeVariant } from "@/lib/badgeVariant";
import formatDate from "@/lib/formatDate";
import formatToPesos from "@/lib/formatToPesos";
import { ChevronRight, Clock, DollarSign, Download, Eye, FileText, Home, MoreHorizontal, Pencil, Wrench, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Sample data
const sampleCondos = [
    {
      id: "condo-1",
      name: "Seaside Retreat",
      address: "123 Ocean View Dr, Miami, FL 33101",
      photo: "/placeholder.svg?height=300&width=600",
      rentAmount: 2500,
      maintenanceFee: 150,
      utilityFee: 100,
      isActive: true,
      createdAt: "2023-01-15T00:00:00Z",
      updatedAt: "2023-06-20T00:00:00Z",
      owner: {
        id: "owner-1",
        name: "John Smith",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      tenant: {
        id: "tenant-1",
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1 (555) 123-4567",
        moveInDate: "2023-02-01T00:00:00Z",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      maintenance: [
        {
          id: "m1",
          title: "Leaking Kitchen Faucet",
          description: "The kitchen faucet has been continuously dripping for the past few days.",
          type: "PLUMBING",
          status: "COMPLETED",
          priority: "MEDIUM",
          cost: 150,
          date: "2023-03-10T10:00:00Z",
          completionDate: "2023-03-12T14:30:00Z",
        },
        {
          id: "m2",
          title: "AC Not Cooling",
          description: "Air conditioning unit is running but not cooling effectively.",
          type: "HVAC",
          status: "COMPLETED",
          priority: "HIGH",
          cost: 450,
          date: "2023-05-15T09:00:00Z",
          completionDate: "2023-05-16T16:00:00Z",
        },
        {
          id: "m3",
          title: "Broken Light Switch",
          description: "Master bedroom light switch is not working properly.",
          type: "ELECTRICAL",
          status: "SCHEDULED",
          priority: "LOW",
          cost: 75,
          date: "2023-07-20T13:00:00Z",
        },
      ],
      payments: [
        {
          id: "p1",
          amount: 2750,
          rentCost: 2500,
          additionalCost: 250,
          method: "GCASH",
          status: "APPROVED",
          reference: "GC123456789",
          date: "2023-02-05T14:30:00Z",
          billMonth: "February 2023",
          receiptUrl: "/placeholder.svg?height=600&width=400",
        },
        {
          id: "p2",
          amount: 2750,
          rentCost: 2500,
          additionalCost: 250,
          method: "MANUAL",
          status: "APPROVED",
          reference: "MAN-2023-001",
          date: "2023-03-03T10:15:00Z",
          billMonth: "March 2023",
        },
        {
          id: "p3",
          amount: 2750,
          rentCost: 2500,
          additionalCost: 250,
          method: "PAYMONGO",
          status: "COMPLETED",
          reference: "PM-987654321",
          date: "2023-04-02T16:45:00Z",
          billMonth: "April 2023",
        },
        {
          id: "p4",
          amount: 2750,
          rentCost: 2500,
          additionalCost: 250,
          method: "GCASH",
          status: "APPROVED",
          reference: "GC987654321",
          date: "2023-05-04T09:20:00Z",
          billMonth: "May 2023",
          receiptUrl: "/placeholder.svg?height=600&width=400",
        },
        {
          id: "p5",
          amount: 2750,
          rentCost: 2500,
          additionalCost: 250,
          method: "MANUAL",
          status: "APPROVED",
          reference: "MAN-2023-002",
          date: "2023-06-05T11:30:00Z",
          billMonth: "June 2023",
        },
        {
          id: "p6",
          amount: 2750,
          rentCost: 2500,
          additionalCost: 250,
          method: "PAYMONGO",
          status: "COMPLETED",
          reference: "PM-123789456",
          date: "2023-07-03T13:10:00Z",
          billMonth: "July 2023",
        },
      ],
      expenses: [
        {
          id: "e1",
          category: "Property Tax",
          description: "Annual property tax payment",
          amount: 3600,
          date: "2023-01-15T00:00:00Z",
          recurring: true,
        },
        {
          id: "e2",
          category: "Insurance",
          description: "Property insurance premium",
          amount: 1200,
          date: "2023-01-20T00:00:00Z",
          recurring: true,
        },
        {
          id: "e3",
          category: "Repairs",
          description: "Plumbing repair - kitchen faucet",
          amount: 150,
          date: "2023-03-12T00:00:00Z",
          recurring: false,
        },
        {
          id: "e4",
          category: "Repairs",
          description: "HVAC repair - AC unit",
          amount: 450,
          date: "2023-05-16T00:00:00Z",
          recurring: false,
        },
        {
          id: "e5",
          category: "Cleaning",
          description: "Professional cleaning service",
          amount: 200,
          date: "2023-06-10T00:00:00Z",
          recurring: false,
        },
      ],
    }
]

function prepareChartData(condo: any) {
    // Create a map to store monthly data
    const monthlyData = new Map<string, { month: string; payments: number; expenses: number }>()
  
    // Get the range of months from the earliest to the latest date
    const allDates = [
      ...condo.payments.map((p: any) => new Date(p.date)),
      ...condo.expenses.map((e: any) => new Date(e.date)),
      ...condo.maintenance.map((m: any) => new Date(m.date)),
    ]
  
    if (allDates.length === 0) return []
  
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))
  
    // Initialize all months in the range with zero values
    const currentDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
  
    while (currentDate <= endDate) {
      const monthKey = currentDate.toLocaleDateString("en-US", { year: "numeric", month: "short" })
      monthlyData.set(monthKey, { month: monthKey, payments: 0, expenses: 0 })
      currentDate.setMonth(currentDate.getMonth() + 1)
    }
  
    // Add payment data
    condo.payments.forEach((payment: any) => {
      const date = new Date(payment.date)
      const monthKey = date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  
      if (monthlyData.has(monthKey)) {
        const data = monthlyData.get(monthKey)!
        data.payments += payment.amount
        monthlyData.set(monthKey, data)
      }
    })
  
    // Add expense data (including maintenance costs)
    condo.expenses.forEach((expense: any) => {
      const date = new Date(expense.date)
      const monthKey = date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  
      if (monthlyData.has(monthKey)) {
        const data = monthlyData.get(monthKey)!
        data.expenses += expense.amount
        monthlyData.set(monthKey, data)
      }
    })
  
    // Add maintenance costs to expenses
    condo.maintenance.forEach((maintenance: any) => {
      const date = new Date(maintenance.date)
      const monthKey = date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  
      if (monthlyData.has(monthKey)) {
        const data = monthlyData.get(monthKey)!
        data.expenses += maintenance.cost
        monthlyData.set(monthKey, data)
      }
    })
  
    // Convert map to array and sort by date
    return Array.from(monthlyData.values()).sort((a, b) => {
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateA.getTime() - dateB.getTime()
    })
}

const ViewCondo = () => {
    const condo = sampleCondos[0];
    console.log(condo)
    if(!condo) {
        return <NotFound />
    }

    const totalMaintenanceCost = condo.maintenance.reduce((sum, item) => sum + item.cost, 0);
    const totalExpenses = condo.expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = condo.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const netIncome = totalIncome - totalExpenses - totalMaintenanceCost;



    return (
        <div className="container py-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <Link to="/dashboard/condo" className="hover:text-foreground">
                    Condos
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{condo.name}</span>
            </div>

            {/* Condo Header */}
            <div className="grid gird-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                    <Card className="overflow-hidden">
                        <div className="relative h-48 md:h-64">
                            <img src={condo.photo} alt={condo.name} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3">
                                <Badge variant={condo.isActive ? "default" : "secondary"}>
                                    {condo.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl">{condo.name}</CardTitle>
                            <CardDescription>{condo.address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-10 w-10 border border-border">
                                        <AvatarImage src={condo.owner.avatar} alt={condo.owner.name} />
                                        <AvatarFallback>{condo.owner.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Owner</p>
                                        <p className="font-medium">{condo.owner.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center border border-border">
                                    {condo.tenant ? (
                                        <>
                                            <Avatar className="h-10 w-10 border border-border">
                                                <AvatarImage src={condo.tenant.avatar} alt={condo.tenant.name} />
                                                <AvatarFallback>{condo.tenant.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Tenant</p>
                                                <p className="font-medium">{condo.tenant.name}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center bg-muted">
                                                <Home className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs">Tenant</p>
                                                <p className="text-sm">No Tenant</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                                Financial Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                                <p className="text-2xl font-bold text-primary">{formatToPesos(condo.rentAmount)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Maintenance Fee</p>
                                    <p className="font-medium">{formatToPesos(condo.maintenanceFee)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Utility Fee</p>
                                    <p className="font-medium">{formatToPesos(condo.utilityFee)}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Monthly</p>
                                <p className="text-xl font-bold">
                                    {formatToPesos(condo.rentAmount + condo.maintenanceFee + condo.utilityFee)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
 
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Income
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatToPesos(totalIncome)}</div>
                        <div className="text-xs text-muted-foreground mt-2">
                            From {condo.payments.length} payments
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Expenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {formatToPesos(totalExpenses)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            Maintenance: {formatToPesos(675)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Net Income
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatToPesos(netIncome)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            {netIncome >= 0 ? "Profit" : "Loss"}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Occupancy Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">26%</div>
                        <div className="mt-2">
                            <Progress value={26} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="payments" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>

                {/* Payments Tab */}
                <TabsContent value="payments" className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle>Payment History</CardTitle>
                                <Button size="sm">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Record Payment
                                </Button>
                            </div>
                            <CardDescription>
                                {condo.payments.length} payment {condo.payments.length !== 1 ? "s" : " "} recorded
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Date</TableHead>
                                        <TableHead>Bill Month</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Reference</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {condo.payments.length > 0 ? (
                                        condo.payments.map((payment) => (
                                            <TableRow>
                                                <TableCell className="font-medium">{formatDate(new Date(payment.date))}</TableCell>
                                                <TableCell>{payment.billMonth}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {}
                                                        <span>{payment.method}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs">{payment.id}</TableCell>
                                                <TableCell className="text-right font-medium">{formatToPesos(payment.amount)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent align="end" className="w-56 p-1">
                                                            <Button variant="ghost" className="w-full justify-start">
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Receipt
                                                            </Button>
                                                            <Button variant="ghost" className="w-full justify-start">
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Condo
                                                            </Button>
                                                            <Separator className="my-1" />
                                                            <Button variant="ghost" className="w-full justify-start">
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download
                                                            </Button>
                                                        </PopoverContent>
                                                    </Popover>
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
                    </Card>

                    {/* Payment vs Expenses Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment vs Expenses</CardTitle>
                            <CardDescription>Monthly comparison of payments received and expenses incurred</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            {condo.payments.length > 0 || condo.expenses.length > 0 || condo.maintenance.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={prepareChartData(condo)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(value) => `$${value}`} />
                                        <Tooltip
                                        formatter={(value) => [`$${value}`, undefined]}
                                        labelFormatter={(label) => `Month: ${label}`}
                                        />
                                        <Legend />
                                        <Area 
                                        type="monotone"
                                        dataKey="payments"
                                        name="Payments"
                                        stackId="1"
                                        stroke="#4ade80"
                                        fill="#4ade8080"
                                        />
                                        <Area 
                                        type="monotone"
                                        dataKey="expenses"
                                        name="Expenses"
                                        stackId="2"
                                        stroke="#f87171"
                                        fill="#f8717180" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    No payment or expense data available for chart visualization
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Maintenance Tab */}
                <TabsContent value="maintenance" className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle>Maintenance History</CardTitle>
                                <Button size="sm">
                                    <Wrench className="mr-2 h-4 w-4" />
                                    New Request
                                </Button>
                            </div>
                            <CardDescription>
                                {condo.maintenance.length} maintenance record{condo.maintenance.length !== 1 ? "s" : ""} found
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Date</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right font-medium">Cost</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {condo.maintenance.length > 0 ? (
                                        condo.maintenance.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{formatDate(new Date(item.date))}</TableCell>
                                                <TableCell>{item.title}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell className="text-right font-medium">{formatToPesos(item.cost)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(item.status as MaintenanceStatus)}>{item.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent align="end" className="w-56 p-1">
                                                            <Button variant="ghost" className="w-full justify-start">
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Details
                                                            </Button>
                                                            <Button variant="ghost" className="w-full justify-start">
                                                                <Clock className="mr-2 h-4 w-4" />
                                                                Update Status
                                                            </Button>
                                                            <Button variant="ghost" className="w-full justify-start">
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit Maintenance
                                                            </Button>
                                                            <Separator className="my-1" />
                                                            <Button 
                                                            variant="ghost" 
                                                            className="w-full justify-start text-destructive focus:text-destructive hover:text-destructive">
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Cancel maintenance
                                                            </Button>
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                                No maintenance records found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Maintenance Cost Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Costs</CardTitle>
                            <CardDescription>
                                Breakdown of maintenance expenses by category
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                Maintenance cost chart visualization would go here
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expenses" className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle>Expense Records</CardTitle>
                                <Button size="sm">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Add Expense
                                </Button>
                            </div>
                            <CardDescription>
                                {condo.expenses.length} expense record{condo.expenses.length !== 1 ? "s": ""} found
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Date</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Recurring</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {condo.expenses.length > 0 ? (
                                        condo.expenses.map((expense) => (
                                            <TableRow key={expense.id}>
                                                <TableCell className="font-medium">{formatDate(new Date(expense.date))}</TableCell>
                                                <TableCell>{expense.category}</TableCell>
                                                <TableCell>{expense.description}</TableCell>
                                                <TableCell className="text-right font-medium">{formatToPesos(expense.amount)}</TableCell>
                                                <TableCell>
                                                    {expense.recurring ? (
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                                            Recurring
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                                                            One-time
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent align="end" className="w-56 p-1">
                                                            <Button variant="ghost" className="w-full justify-start">
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </Button>
                                                            <Button variant="ghost" className="w-full justify-start">
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download Receipt
                                                            </Button>
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                                No expense records found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Expense Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Expense Breakdown</CardTitle>
                            <CardDescription>Distribution of expense by category</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                Expense breakdown chart visualization would go here
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ViewCondo