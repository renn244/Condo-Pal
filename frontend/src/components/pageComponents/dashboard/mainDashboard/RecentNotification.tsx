import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { InfiniteData, useQuery } from "@tanstack/react-query"
import NotificationCard from "../../common/Notifications/NotificationCard"

const RecentNotification = () => {

    const {
        data: notifications,
        isLoading,
    } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await axiosFetch.get("/notification");
            return res.data as InfiniteData<getNotifications>; // Assume this is the full list
        },
    });

    if(isLoading) return <LoadingSpinner />
    
    if(!notifications) return null;

    const unreadNotifications = notifications.pages?.[0]?.unreadCount;;
    const notification = notifications.pages?.[0]?.notifications || [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Notifications</CardTitle>
                {unreadNotifications > 0 && (
                    <Badge>{unreadNotifications}</Badge>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {notification.slice(0, 4).map((notification) => (
                    <NotificationCard notification={notification} />
                ))}
            </CardContent>
            <CardFooter className="border-t pb-2 flex-row justify-center pt-1">
                <Button variant="ghost">
                    View All Notifications
                </Button>
            </CardFooter>
        </Card>
    )
}

export default RecentNotification