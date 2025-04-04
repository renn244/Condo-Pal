import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axiosFetch from "@/lib/axios";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import MaintenanceMessage from "./MaintenanceMessage";
import MaintenanceMessageInput from "./MaintenanceMessageInput";
import { useEffect } from "react";

type MaintenanceChatProps = {
    maintenanceId: string;
}

const MaintenanceChat = ({
    maintenanceId
}: MaintenanceChatProps) => {
    const fetchMaintenanceMessages = async ({ pageParam: cursor = null }: { pageParam: string | null }) => {
        const response = await axiosFetch.get(`/maintenance-message/getMessages?maintenanceId=${maintenanceId}&cursor=${cursor || ''}`);

        if(response.status >= 400) {
            throw new Error(response.data.message);
        }

        return response.data as MaintenanceGetMessages;
    }

    // useinfinite query
    const { 
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery<
        MaintenanceGetMessages, 
        Error, 
        InfiniteData<MaintenanceGetMessages>, 
        ['maintenanceChat', string], 
        string | null
    >({
        queryKey: ['maintenanceChat', maintenanceId],
        queryFn: fetchMaintenanceMessages,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    // listen to socket messages
    useEffect(() => {

    }, [maintenanceId])

    const chatMessages = data?.pages.flatMap((page) =>
        page.messages
    ) || [];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Communication</CardTitle>
                <CardDescription>Chat with tenant and landlord</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col h-[400px]">
                    <div id="messageContainer" className="flex-1 overflow-y-auto flex flex-col-reverse">
                        <InfiniteScroll
                        style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                        dataLength={chatMessages.length}
                        next={() => fetchNextPage()}
                        hasMore={hasNextPage}
                        inverse={true}
                        scrollableTarget={"messageContainer"}
                        loader={<LoadingSpinner />}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>You have seen it all</b>
                            </p>   
                        }
                        >
                            {chatMessages?.map((message) => (
                                <MaintenanceMessage 
                                message={message}
                                key={message.id}
                                />
                            ))}
                        </InfiniteScroll>
                    </div>

                    {/* Attachment Previews */}
                    {/* {attachmentPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {attachmentPreviews.map((preview, index) => (
                            <div key={index} className="relative h-16 w-16">
                                <img
                                src={preview || "/placeholder.svg"}
                                alt={`Attachment preview ${index + 1}`}
                                className="h-16 w-16 object-cover rounded-md border"
                                />
                                <button
                                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center"
                                onClick={() => removeAttachment(index)}
                                >
                                <X className="h-3 w-3" />
                                </button>
                            </div>
                            ))}
                        </div>
                    )} */}

                    {/* Message Input */}
                    <MaintenanceMessageInput maintenanceId={maintenanceId} />
                </div>
            </CardContent>
        </Card>
    )
}

export default MaintenanceChat