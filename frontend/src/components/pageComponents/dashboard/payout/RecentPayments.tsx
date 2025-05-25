import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronRightIcon, SearchIcon } from "lucide-react"
import { Link } from "react-router-dom"
import RecentPaymentCard from "./RecentPaymentCard"
import { useQuery } from "@tanstack/react-query"
import axiosFetch from "@/lib/axios"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { useState } from "react"

const RecentPayments = () => {
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["recent", "payments", search],
        queryFn: async () => {
            const response = await axiosFetch.get("/condo-payment/condoPayments", {
                params: { page: "1", paymentType: "PAYMONGO", search: search || "" }
            });

            return response.data as CondoPaymentsDashboard;
        }
    })

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Payments</CardTitle>
                    <CardDescription>Payments received from tenants</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search payments..." className="pl-8 w-[300px]" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        data?.getCondoPayments && data.getCondoPayments.length > 0 ? (
                            data.getCondoPayments.map((transaction) => (
                                <RecentPaymentCard transaction={transaction} />
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground">
                                No payments found.
                            </div>
                        )
                    )}
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