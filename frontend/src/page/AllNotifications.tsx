import LoadingSpinner from "@/components/common/LoadingSpinner"
import NotificationCard from "@/components/pageComponents/common/Notifications/NotificationCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axiosFetch from "@/lib/axios"
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, Search } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import InfiniteScroll from "react-infinite-scroll-component"

const AllNotifications = () => {
    const queryClient = useQueryClient();
    const [notificationType, setNotificationType] = useState<NotificationType | "ALL">("ALL");

    const {
        data: notificationsData,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery<getNotifications, Error, InfiniteData<getNotifications>, ['allnotifications', typeof notificationType], string | null>({
        queryKey: ["allnotifications", notificationType],
        queryFn: async ({ pageParam = null }) => {
            const response = await axiosFetch.get("/notification/filter", {
                params: {
                    cursor: pageParam || "",
                    type: notificationType || "ALL",
                }
            })

            return response.data as getNotifications;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null,
    })

    const markRead = async (notificationId: string) => {
        const response = await axiosFetch.patch(`/notification/${notificationId}`);

        return response.data;
    }

    const { mutate: markAllAsRead, isPending } = useMutation({
        mutationKey: ["markAllAsRead"],
        mutationFn: async () => {
            const response = await axiosFetch.patch(`/notification/markAllAsRead`);

            return response.data;
        },
        onSuccess: async () => {
            toast.success("All notifications marked as read")

            await queryClient.setQueryData(["allnotifications", notificationType], (oldData: InfiniteData<getNotifications> | undefined) => {
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

    const notifications = notificationsData?.pages.flatMap((page) => page.notifications) || [];
    const unreadCount = notificationsData?.pages[0].unreadCount || 0;
    
    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center mb-6">
                <Button onClick={() => window.history.back()} 
                variant="ghost" size="icon" className="mr-4" >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg md:text-2xl font-bold">
                    All Notification
                </h1>
                <Badge variant="secondary" className="ml-3">
                    {unreadCount} unread
                </Badge>
                <div className="ml-auto flex gap-2">
                    <Button onClick={() => markAllAsRead()} disabled={isPending} variant="outline" size="sm">
                        {isPending ? <LoadingSpinner /> : "Mark all as read"}
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search Notifications" className="pl-10" />
                    </div>
                    <Select value={notificationType} onValueChange={value => setNotificationType(value as typeof notificationType)} defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Notifications" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Notifications</SelectItem>
                            <SelectItem value="PAYMENT">Payment</SelectItem>
                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                            <SelectItem value="LEASE_AGREEMENT">Lease Agreement</SelectItem>
                            <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="max-h-[640px] overflow-y-auto" id="notificationContainer">
                <InfiniteScroll
                dataLength={notifications.length}
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
                        <NotificationCard notification={notification} markRead={markRead} />
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default AllNotifications