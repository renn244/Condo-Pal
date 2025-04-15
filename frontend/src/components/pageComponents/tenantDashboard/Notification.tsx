import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell, ChevronRight, DollarSign, FileText, Wrench } from "lucide-react"
import { Link } from "react-router-dom"

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

const Notification = () => {
    const [unreadCount] = useState(notifications.filter((notification) => !notification.isRead).length)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px]">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="font-medium">Notifications</h3>
                    <Button variant="ghost" size="sm" onClick={() => undefined}>
                        Mark all as read
                    </Button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notification) => (
                        <div
                        key={notification.id}
                        className={`px-4 py-3 border-b hover:bg-muted/50 ${!notification.isRead ? "bg-blue-50/50" : ""}`}
                        >
                            <div className="flex gap-3">
                                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-sm">{notification.title}</h4>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(notification.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                    {notification.actionUrl && (
                                    <Link
                                    to={notification.actionUrl}
                                    className="text-sm text-primary flex items-center mt-2 hover:underline"
                                    >
                                        View Details
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-2 text-center border-t">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/tenant/notifications">View All Notifications</Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Notification