import LoadingSpinner from "@/components/common/LoadingSpinner"
import LatestSubscriptionCard from "@/components/pageComponents/subscriptionExpired/LatestSubscriptionCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import formatDate from "@/lib/formatDate"
import { useQuery } from "@tanstack/react-query"
import { AlertTriangle, CheckCircle2, Clock, HelpCircle, X } from "lucide-react"
import { Link } from "react-router-dom"

const SubscriptionExpired = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["subscription", "latest"],
        queryFn: async () => {
            const response = await axiosFetch.get("/subscription/latest");

            if(response.status === 404) {
                return null
            }

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data as getLatestSubscription;
        }
    })

    if(isLoading) return <LoadingSpinner />

    if(error) {
        return
    }

    if(!data) {
        window.location.assign("/pricing");
        return null
    }

    const formmatedExpiryDate = data?.expiresAt ?
        formatDate(new Date(data.expiresAt))
        : null

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="flex flex-col items-center text-center mb-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">Your Subscription Has Expired</h1>
                <p className="text-muted-foreground max-w-2xl">
                    Your access to CondoPal's premium features has been limited. Choose a plan below to restore full access to all
                    features and continue managing your properties.
                </p>
            </div>

            <LatestSubscriptionCard subscriptionInfo={data} />

            <div className="grid gap-6 mb-10">
                <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border bg-muted/30">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-medium">Your subscription expired on {formmatedExpiryDate}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            You're currently in limited access mode. Some features are restricted until you renew your subscription.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Limitations</CardTitle>
                            <CardDescription>These features are currently restricted or limited</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {[
                                    "Limited to viewing only 2 properties",
                                    "No access to financial reports",
                                    "Limited maintenance request management",
                                    "No tenant communication tools",
                                    "No access to document storage",
                                    "Basic dashboard only",
                                ].map((limitation, i) => (
                                <li key={i} className="flex items-start">
                                    <div className="mr-2 mt-0.5">
                                        <X className="h-4 w-4 text-red-500" />
                                    </div>
                                    <span className="text-sm">{limitation}</span>
                                </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Restore These Features</CardTitle>
                            <CardDescription>Renew your subscription to regain access to all features</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {[
                                    "Unlimited property management",
                                    "Complete financial reporting",
                                    "Full maintenance request system",
                                    "Advanced tenant communication",
                                    "Document storage and management",
                                    "Advanced analytics dashboard",
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="mr-2 mt-0.5">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 border">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="font-medium text-lg mb-2">Need help with your subscription?</h3>
                        <p className="text-muted-foreground mb-4">
                            Our support team is ready to assist you with any questions about your subscription or help you choose the
                            right plan for your needs.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" asChild>
                                <Link to="/contact">Contact Support</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/faq">View FAQ</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionExpired