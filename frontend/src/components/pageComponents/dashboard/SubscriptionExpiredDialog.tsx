import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Clock } from "lucide-react"
import { Link } from "react-router-dom"

const SubscriptionExpiredDialog = () => {
    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-center text-xl font-semibold text-red-600">
                        Your Subscription Has Expired
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Your access to CondoPal's premium features has been limited. Renew now to continue managing your properties
                        without interruption.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="rounded-lg border p-4 bg-muted/50">
                        <h3 className="font-medium mb-2 flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            Your subscription expired on:
                        </h3>
                        <p className="text-sm text-muted-foreground">May 15, 2025</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-medium">Limited access to:</h3>
                        <ul className="space-y-2">
                        {[
                            "Property management features",
                            "Tenant communication tools",
                            "Financial reporting",
                            "Maintenance request management",
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
                        <Link to="/subscription-expired">View Plans</Link>
                    </Button>
                    <Button className="sm:w-auto w-full" >
                        Renew Subscription
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SubscriptionExpiredDialog