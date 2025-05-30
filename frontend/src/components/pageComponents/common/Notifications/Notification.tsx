import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSocketContext } from "@/context/SocketContext"
import axiosFetch from "@/lib/axios"
import { playAudio } from "@/lib/playAudio"
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Bell } from "lucide-react"
import { useEffect } from "react"
import toast from "react-hot-toast"
import InfiniteScroll from "react-infinite-scroll-component"
import { Link } from "react-router-dom"
import NotificationCard from "./NotificationCard"

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
            // notitication
            if(document.hidden) {
                playAudio("/messages/messenger-notif-not-focus.mp3");
            } else {
                playAudio("/messages/chat-audio-focus.mp3");
            }

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

    // markRead the Link
    const markRead = async (notificationId: string) => {
        const response = await axiosFetch.patch(`/notification/${notificationId}`);

        await queryClient.setQueryData(["notifications"], (oldData: InfiniteData<getNotifications> | undefined) => {
            if(!oldData) return oldData;

            return {
                ...oldData,
                pages: oldData.pages.map((page, idx) => {
                    if(idx === 0) {
                        return {
                            ...page, unreadCount: page.unreadCount - 1,
                            notifications: page.notifications.map((notification) => ({ ...notification, isRead: true, })),
                        }
                    }
                    return page;
                })
            }
        })

        return response.data;
    }

    // markAllAsRead
    const { mutate: markAllAsRead, isPending } = useMutation({
        mutationKey: ["markAllAsRead"],
        mutationFn: async () => {
            const response = await axiosFetch.patch(`/notification/markAllAsRead`);

            return response.data;
        },
        onSuccess: async () => {
            toast.success("All notifications marked as read")

            await queryClient.setQueryData(["notifications"], (oldData: InfiniteData<getNotifications> | undefined) => {
                if(!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page, idx) => {
                        if(idx === 0) {
                            return {
                                ...page, unreadCount: 0,
                                notifications: page.notifications.map((notification) => ({ ...notification, isRead: true, })),
                            }
                        }
                        return page;
                    })
                }
            })
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
            <DropdownMenuContent align="end" className="w-[400px]">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button disabled={isPending} variant="ghost" size="sm" onClick={() => markAllAsRead()}>
                            {isPending ? <LoadingSpinner /> : "Mark all as read"}
                        </Button>
                    )}
                </div>
                <div id="notificationContainer" className="max-h-[350px] overflow-y-auto">
                    <InfiniteScroll 
                    dataLength={notifications?.length || 0}
                    next={() => fetchNextPage()}
                    hasMore={hasNextPage}
                    scrollableTarget={"notificationContainer"}
                    loader={<div className="flex justify-center"><LoadingSpinner /></div>}
                    endMessage={
                        <div className="flex justify-center py-2 text-sm text-muted-foreground">
                            {notifications.length === 0 ? "No notifications" : "No more notifications"}
                        </div>
                    }
                    >
                        {notifications.map((notification) => (
                            <NotificationCard key={notification.id} notification={notification} markRead={markRead} />
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