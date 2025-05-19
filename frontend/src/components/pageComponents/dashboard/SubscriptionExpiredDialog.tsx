import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import axiosFetch from "@/lib/axios"
import formatDate from "@/lib/formatDate"
import { useQuery } from "@tanstack/react-query"
import { AlertTriangle, Clock, Info } from "lucide-react"
import { Link } from "react-router-dom"

type SubscriptionExpiredDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
}

const SubscriptionExpiredDialog = ({
    open, onOpenChange
}: SubscriptionExpiredDialogProps) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["subscription", "latest"],
        queryFn: async () => {
            const response = await axiosFetch.get("/subscription/latest");

            if(response.status === 404) {
                return null;
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
    
    const isExpired = data === null ? false : true
    const formmatedExpiryDate = data?.expiresAt ? 
        formatDate(new Date(data.expiresAt))
        : null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-1">
                        {isExpired ? (
                            <AlertTriangle className="h-6 w-6 text-amber-600" />
                        ) : (
                            <Info className="h-6 w-6 text-amber-600" />
                        )}
                    </div>
                    <DialogTitle className="text-center text-xl font-semibold text-amber-600">
                        {isExpired ? "Your Subscription Has Expired" : "No Active Subscription"}
                    </DialogTitle>
                    <DialogDescription className="text-center pt-1">
                        {isExpired
                            ? "Your access to CondoPal's premium features has been limited. Renew now to continue managing your properties without interruption."
                            : "You currently don't have an active subscription. Subscribe now to access CondoPal's premium features and start managing your properties efficiently."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {isExpired && formmatedExpiryDate && (
                        <div className="rounded-lg border p-4 bg-muted/50">
                            <h3 className="font-medium mb-2 flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                Your subscription expired on:
                            </h3>
                            <p className="text-sm text-muted-foreground">{formmatedExpiryDate}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <h3 className="font-medium">{isExpired ? "Limited access to:" : "Subscribe to access:"}</h3>
                        <ul className="space-y-2">
                            {[
                                "Property management features",
                                "Tenant communication tools",
                                "Financial reporting",
                                "Maintenance request management",
                                "Document storage and sharing",
                            ].map((feature, i) => (
                                <li key={i} className="flex items-start">
                                    <div className="mr-2 mt-0.5">
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    </div>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div> 

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="sm:w-auto w-full" asChild>
                        <Link to="/pricing">View Plans</Link>
                    </Button>
                    {isExpired && (
                        <Button className="sm:w-auto w-full" asChild>
                            <Link to={"/subscription-expired"}>
                                Renew Subscription                    
                            </Link>
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SubscriptionExpiredDialog