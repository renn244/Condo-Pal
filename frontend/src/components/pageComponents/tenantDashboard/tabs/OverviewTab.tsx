import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { Bell, DollarSign, ExternalLink, FileText, Info, MessageSquare, Receipt, Wrench } from "lucide-react"
import { Link } from "react-router-dom"

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

const notifications: any[] = [
    {
      id: "notif-1",
      type: "PAYMENT",
      title: "Rent Due Soon",
      message: "Your rent payment of $2,500 is due on April 1, 2024.",
      date: "2024-03-25T09:00:00Z",
      isRead: false,
      actionUrl: "/tenant/payments",
    },
    {
      id: "notif-2",
      type: "MAINTENANCE",
      title: "Maintenance Request Update",
      message: "Your maintenance request for 'Leaking Kitchen Faucet' has been scheduled for March 30, 2024.",
      date: "2024-03-24T14:30:00Z",
      isRead: true,
      actionUrl: "/tenant/maintenance",
    },
    {
      id: "notif-3",
      type: "ANNOUNCEMENT",
      title: "Building Maintenance Notice",
      message: "The water will be shut off on April 2nd from 10 AM to 2 PM for scheduled maintenance.",
      date: "2024-03-23T11:15:00Z",
      isRead: true,
    },
    {
      id: "notif-4",
      type: "LEASE",
      title: "Lease Renewal Coming Up",
      message: "Your lease expires on May 31, 2024. Please contact management to discuss renewal options.",
      date: "2024-03-20T10:00:00Z",
      isRead: false,
      actionUrl: "/tenant/lease",
    },
]

const OverviewTab = () => {

    

    // Get notification icon
    const getNotificationIcon = (type: any) => {
        switch (type) {
        case "PAYMENT":
            return <DollarSign className="h-5 w-5 text-blue-500" />
        case "MAINTENANCE":
            return <Wrench className="h-5 w-5 text-purple-500" />
        case "ANNOUNCEMENT":
            return <Bell className="h-5 w-5 text-amber-500" />
        case "LEASE":
            return <FileText className="h-5 w-5 text-green-500" />
        }
    }

    return (
        <TabsContent value="overview" className="space-y-6">
            {/* Lease Summary Card */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Lease Summary</CardTitle>
                            <CardDescription>{currentLease.status}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Property</h3>
                                <p className="font-medium">{currentLease.propertyAddress}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Lease Start</h3>
                                    <p className="font-medium">{formatDate(new Date(currentLease.startDate))}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Lease End</h3>
                                    <p className="font-medium">{formatDate(new Date(currentLease.endDate))}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Rent</h3>
                                    <p className="font-medium">{formatToPesos(currentLease.monthlyRent)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Security Deposit</h3>
                                    <p className="font-medium">{formatToPesos(currentLease.securityDeposit)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium">Next Payment</h3>
                                    {/* {getPaymentStatusBadge("UPCOMING")} */}
                                </div>
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

                            <div className="flex gap-2">
                                <Button className="flex-1">Make a Payment</Button>
                                <Button variant="outline" className="flex-1">
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Lease
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Announcement & Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Announcements & Notifications</CardTitle>
                    </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {notifications.slice(0, 3).map((notification) => (
                        <div
                        key={notification.id}
                        className={`p-4 rounded-md border ${!notification.isRead ? "bg-blue-50/50" : ""}`}
                        >
                            <div className="flex gap-4">
                                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium">{notification.title}</h3>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(notification.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                    {notification.actionUrl && (
                                        <div className="mt-2">
                                            <Button variant="outline" size="sm" asChild>
                                            <Link to={notification.actionUrl}>
                                                View Details
                                                <ExternalLink className="ml-2 h-3 w-3" />
                                            </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                        <Link to="/tenant/notifications">View All Notifications</Link>
                    </Button>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">Contact Management</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Questions or concerns? Reach out to your property manager.
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                                Send Message
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <Wrench className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">Maintenance Request</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Submit a new maintenance request for your property.
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                                New Request
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <Receipt className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">Payment History</h3>
                            <p className="text-sm text-muted-foreground mb-4">View your complete payment history and receipts.</p>
                            <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link to="/tenant/payments">View History</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-3 bg-primary/10 rounded-full mb-4">
                                <Info className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium mb-1">Building Info</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Access important information about your building.
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                                View Details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    )
}

export default OverviewTab