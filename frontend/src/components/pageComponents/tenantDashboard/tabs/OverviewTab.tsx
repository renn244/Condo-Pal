import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { useAuthContext } from "@/context/AuthContext"
import { formatBillingMonth } from "@/lib/formatBillingMonth"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import PaymentDueMeter from "../../dashboard/payments/PaymentDueMeter"
import RecentNofitications from "../RecentNofitications"

type OverviewTabProps = {
    paymentSummary: CondoBillInformation
}

const OverviewTab = ({
    paymentSummary,
}: OverviewTabProps) => {
    const { user } = useAuthContext();

    // we use the user.created at date to determine the lease start date because it is created when the lease is created
    const leaseStarted = user!.createdAt; // we already check this in the parent component

    return (
        <TabsContent value="overview" className="space-y-6">
            {/* Lease Summary Card */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Lease Summary</CardTitle>
                            <CardDescription>{paymentSummary.name}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Property Owner</h3>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border border-border">
                                        <AvatarImage className="h-9 w-9 select-none" src={paymentSummary.owner.profile} />
                                        <AvatarFallback>{paymentSummary.owner.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-medium">{paymentSummary.owner.name}</p>
                                </div>
                            </div>
                            <div className="max-w-[603px]">
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Property</h3>
                                <p className="font-medium">{paymentSummary.name}, {paymentSummary.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Lease Start</h3>
                                    <p className="font-medium">{formatDate(new Date(leaseStarted))}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Rent</h3>
                                    <p className="font-medium">{formatToPesos(paymentSummary.rentCost)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium">Next Payment</h3>
                                    <span className="font-medium">{formatBillingMonth(paymentSummary.billingMonth)}</span>
                                </div>
                                <p className="text-2xl font-bold text-primary">{formatToPesos(paymentSummary.totalCost)}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-muted-foreground">Due Date</span>
                                    <span className="font-medium">{formatDate(new Date(paymentSummary.dueDate))}</span>
                                </div>
                                <PaymentDueMeter dueDate={paymentSummary.dueDate} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Announcement & Notifications */}
            <RecentNofitications />

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center h-full">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">Contact Management</h3>
                            <p className="text-sm text-muted-foreground h-8 mb-4">
                                Questions or concerns? Reach out to your property manager.
                            </p>
                            <Button variant="outline" size="sm" className="mt-auto w-full">
                                Send Message
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center h-full">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <Wrench className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">Maintenance Request</h3>
                            <p className="text-sm text-muted-foreground h-8 mb-4">
                                Submit a new maintenance request for your property.
                            </p>
                            <Button variant="outline" size="sm" className="mt-auto w-full" asChild>
                                <Link to={`/tenant/maintenanceRequest`}>
                                    New Request
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center h-full">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <Info className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">Building Info</h3>
                            <p className="text-sm text-muted-foreground mb-4 h-8">
                                Access important information about your building.
                            </p>
                            <Button variant="outline" size="sm" className="mt-auto w-full">
                                View Details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div> */}
        </TabsContent>
    )
}

export default OverviewTab