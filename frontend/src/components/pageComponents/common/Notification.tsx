import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSocketContext } from "@/context/SocketContext"
import axiosFetch from "@/lib/axios"
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Bell, ChevronRight, DollarSign, FileText, Wrench } from "lucide-react"
import { useEffect } from "react"
import toast from "react-hot-toast"
import InfiniteScroll from "react-infinite-scroll-component"
import { Link } from "react-router-dom"

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

type NotificationProps = {
    linkToAllNotifications: string,
}

const Notification = ({
    linkToAllNotifications
}: NotificationProps) => {
    const { socket } = useSocketContext();
    const queryClient = useQueryClient();

    const { 
        data: notificationsData,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery<getNotifications, Error, InfiniteData<getNotifications>, ['notifications'], string | null>({
        queryKey: ["notifications"],
        queryFn: async ({ pageParam = null }) => {
            const response = await axiosFetch.get("/notification", {
                params: { cursor: pageParam || "" }
            })

            return response.data as getNotifications;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null,
    })

    // useEffect listen to socket and add to the page 1(recent)
    useEffect(() => {
        if(!socket) return;

        socket.on("newNotification", async (notification: notification) => {
            await queryClient.setQueryData(["notifications"], 
                (oldData: InfiniteData<getNotifications> | undefined) => {
                    if(!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page, idx) => {
                            if(idx === 0) {
                                return {
                                    ...page,
                                    notifications: [notification, ...page.notifications],
                                    unreadCount: (page.unreadCount || 0) + 1,
                                }
                            }

                            return page;
                        })
                    }
                }
            )
        })

        return () => {
            socket.off("newNotification")
        }
    }, [socket])

    // markAllAsRead
    const { mutate: markAllAsRead, isPending } = useMutation({
        mutationKey: ["markAllAsRead"],
        mutationFn: async () => {
            const response = await axiosFetch.patch(`/notification/markAllAsRead`);

            return response.data;
        },
        onSuccess: () => {
            toast.success("All notifications marked as read")
        },
        onError: () => {
            toast.error("Failed to mark all notifications as read")
        },
    })

    // flatmap it
    const notifications = notificationsData?.pages.flatMap((page) => page.notifications) || [];
    const unreadCount = notificationsData?.pages?.[0]?.unreadCount || 0;

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
                    <Button disabled={isPending} variant="ghost" size="sm" onClick={() => markAllAsRead()}>
                        {isPending ? <LoadingSpinner /> : "Mark all as read"}
                    </Button>
                </div>
                <div id="notificationContainer" className="max-h-[400px] overflow-y-auto">
                    <InfiniteScroll 
                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                    dataLength={notifications.length}
                    next={() => fetchNextPage()}
                    hasMore={hasNextPage}
                    inverse={true}
                    scrollableTarget={"notificationContainer"}
                    loader={<div className="flex justify-center"><LoadingSpinner /></div>}
                    endMessage={
                        <div className="flex justify-center py-2 text-sm text-muted-foreground">
                            {notifications.length === 0 ? "No notifications" : "No more notifications"}
                        </div>
                    }
                    >
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
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                        {notification.link && (
                                            <Link
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
                        ))}
                    </InfiniteScroll>
                </div>
                <div className="p-2 text-center border-t">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to={linkToAllNotifications}>View All Notifications</Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Notification