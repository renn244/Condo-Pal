import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import axiosFetch from "@/lib/axios"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import formatToPesos from "@/lib/formatToPesos"
import formatDate from "@/lib/formatDate"
import { Link } from "react-router-dom"
import { Check } from "lucide-react"
import SubscriptionHistory from "./SubscriptionHistory"

const Subscription = () => {

    const { data: currentPlan, isLoading, error } = useQuery({
        queryKey: ['currentPlan'],
        queryFn: async () => {
            const response = await axiosFetch.get('/subscription/getCurrentPlan');

            if(response.status >= 400) {
                throw new Error('Failed to fetch current plan');
            }

            return response.data as getCurrentPlan;
        },
        refetchOnWindowFocus: false,
    })

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        currentPlan ? (
                            <div className="bg-primary/5 border rounded-lg p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                            Current Plan
                                        </Badge>
                                        <h3 className="text-xl font-bold">{currentPlan.type} Plan</h3>
                                        <p className="text-muted-foreground">
                                            {formatToPesos(currentPlan.price)}/month • {formatDate(new Date(currentPlan.createdAt))}-{formatDate(new Date(currentPlan.expiresAt))}
                                            </p>
                                    </div>
                                    {/* <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" className="text-destructive hover:text-destructive">
                                            Cancel
                                        </Button>
                                    </div> */}
                                </div>
                                <Separator className="my-6" />
                                <div className="grid grid-cols-1 gap-2">
                                    <h4 className="text-sm font-medium mb-2">Plan Features</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {currentPlan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            error ? (
                                <div>
                                    <p className="text-lg font-semibold text-red-500">There seems to be a problem</p>
                                    <p className="text-sm text-red-500">{(error as Error).message}</p>
                                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                                        Retry
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-lg font-semibold">No active subscription found</p>
                                    <p className="text-sm text-muted-foreground">You can subscribe to a plan to unlock premium features.</p>
                                    <Button className="mt-4" asChild>
                                        <Link to="/pricing">
                                            Subscribe Now
                                        </Link>
                                    </Button>
                                </div>
                            )
                        )
                    )}
                </CardContent>
            </Card>
            <SubscriptionHistory />
        </>
    )
}

export default Subscription