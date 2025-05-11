import { NotificationType } from "@/constant/notification.constants";
import { Bell, CreditCard, DollarSign, FileText, MessageSquare, Wrench } from "lucide-react"

const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "h-5 w-5";
        
    switch (type) {
        case NotificationType.PAYMENT:
            return <DollarSign className={`${iconClass} text-blue-500`} />;
        case NotificationType.MAINTENANCE:
            return <Wrench className={`${iconClass} text-purple-500`} />;
        case NotificationType.MESSAGE:
            return <MessageSquare className={`${iconClass} text-sky-500`} />;
        case NotificationType.EXPENSE:
            return <CreditCard className={`${iconClass} text-rose-500`} />;
        case NotificationType.LEASE_AGREEMENT:
            return <FileText className={`${iconClass} text-green-500`} />;
        case NotificationType.SUBSCRIPTION:
            return <Bell className={`${iconClass} text-amber-500`} />;
        default:
            return <Bell className={`${iconClass} text-gray-500`} />;
  }
}

export default getNotificationIcon;