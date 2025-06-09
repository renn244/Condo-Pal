import formatSmartDate from "@/lib/formatSmartDate"
import getNotificationIcon from "@/lib/getNotificationIcon"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

type NotificationCardProps = {
    notification: notification,
    markRead?: (notificationId: string) => Promise<void>
}

const NotificationCard = ({
    notification,
    markRead
}: NotificationCardProps) => {

    return (
        <div
        key={notification.id}
        className={`px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 ${!notification.isRead ? "bg-blue-50/50" : ""}`}
        >
            <div className="flex gap-3">
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                            {formatSmartDate(new Date(notification.createdAt))}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    {notification.link && (
                        <Link
                        onClick={() => markRead && markRead(notification.id)}
                        to={notification.link}
                        className="text-sm text-primary flex items-center mt-2 hover:underline"
                        >
                            View Details
                            <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NotificationCard