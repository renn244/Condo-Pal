import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronRightIcon, SearchIcon } from "lucide-react"
import { Link } from "react-router-dom"
import RecentPaymentCard from "./RecentPaymentCard"

const transactions = [
    {
        id: "txn_123456",
        date: "2023-07-28",
        amount: 2500,
        description: "July 2023 Rent",
        tenant: "Alice Johnson",
        property: "Seaside Retreat",
        status: "completed",
        paymentMethod: "card",
    },
    {
        id: "txn_123457",
        date: "2023-07-25",
        amount: 3200,
        description: "July 2023 Rent",
        tenant: "Bob Smith",
        property: "Downtown Loft",
        status: "completed",
        paymentMethod: "gcash",
    },
    {
        id: "txn_123458",
        date: "2023-07-24",
        amount: 2800,
        description: "July 2023 Rent",
        tenant: "Jennifer Garcia",
        property: "Mountain View",
        status: "completed",
        paymentMethod: "bank",
    },
    {
        id: "txn_123459",
        date: "2023-08-01",
        amount: 3500,
        description: "August 2023 Rent",
        tenant: "Michael Brown",
        property: "Sunset Heights",
        status: "pending",
        paymentMethod: "maya",
    }
]

const RecentPayments = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Payments</CardTitle>
                    <CardDescription>Payments received from tenants</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search payments..." className="pl-8 w-[200px]" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <RecentPaymentCard transaction={transaction} />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button variant="ghost" className="w-full" asChild>
                    <Link to="/dashboard/payments?search=&paymentType=PAYMONGO&status=ALL">
                        View All Payments
                        <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default RecentPayments