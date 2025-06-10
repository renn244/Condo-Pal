import TenantRecentNotificationSkeleton from "@/components/skeleton/TenantRecentNotificationSkeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import getNotificationIcon from "@/lib/getNotificationIcon"
import { useQuery } from "@tanstack/react-query"
import { BellOff, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"

const RecentNofitications = () => {
    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications", "recent"],
        queryFn: async () => {
            const response = await axiosFetch.get("/notification/recent");

            return response.data as notifications;
        }
    })

    if(isLoading) return <TenantRecentNotificationSkeleton />

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((notification) => (
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
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                        {notification.link && (
                                            <div className="mt-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link to={notification.link}>
                                                        View Details
                                                        <ExternalLink className="ml-2 h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[250px] w-full bg-muted rounded-xl">
                            <BellOff className="h-8 w-8 text-muted-foreground" />
                            <p className="text-lg text-muted-foreground mt-2">No recent notifications</p>
                        </div>
                    )}
                </div>
            </CardContent>
            {notifications && notifications.length > 0 && (
                <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                        <Link to="/tenant/notifications">View All Notifications</Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

export default RecentNofitications