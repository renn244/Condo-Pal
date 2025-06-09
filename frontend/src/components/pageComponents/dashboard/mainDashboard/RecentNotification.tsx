import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import NotificationCard from "../../common/Notifications/NotificationCard"
import RecentNotificationSkeleton from "@/components/skeleton/RecentNotificationSkeleton"

const RecentNotification = () => {

    const {
        data: notifications,
        isLoading,
    } = useQuery({
        queryKey: ["notifications", "recent"],
        queryFn: async () => {
            const response = await axiosFetch.get("/notification/recent", { 
                params: { take: 4 }
            });
            return response.data as notifications;
        },
    });

    if(isLoading) return <RecentNotificationSkeleton />
    
    if(!notifications) return null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {notifications.map((notification) => (
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