import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axiosFetch from "@/lib/axios";
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { io } from "socket.io-client";
import MaintenanceMessage from "./MaintenanceMessage";
import MaintenanceMessageInput from "./MaintenanceMessageInput";
import MaintenancePhotoViewer from "./MaintenancePhotoViewer";
import useMaintenanceWorkerParams from "@/hooks/useMaintenanceWorkerParams";
import { playAudio } from "@/lib/playAudio";

type MaintenanceChatProps = {
    maintenanceId: string;
}

const MaintenanceChat = ({
    maintenanceId
}: MaintenanceChatProps) => {
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
    const queryClient = useQueryClient();
    const { token } = useMaintenanceWorkerParams();

    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery<MaintenanceGetMessages, Error, InfiniteData<MaintenanceGetMessages>, ['maintenanceChat', string], string | null>({
        queryKey: ['maintenanceChat', maintenanceId],
        queryFn: async ({ pageParam: cursor = null }: { pageParam: string | null }) => {
            const response = await axiosFetch.get(`/maintenance-message/getMessages?token=${token}&maintenanceId=${maintenanceId}&cursor=${cursor || ''}`);
            
            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data as MaintenanceGetMessages;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    useEffect(() => {
        // Define the socket connection in the effect
        const socket = io("http://localhost:5000/maintenance-message", {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            transports: ["websocket"],
            query: {
                maintenanceId: maintenanceId,
            }
        });

        socket.on('newMessage', async (message: MaintenanceMessageWithSender) => {
            await queryClient.setQueryData(['maintenanceChat', maintenanceId], (oldData: InfiniteData<MaintenanceGetMessages, unknown> | undefined) => {
                if(document.hidden) {
                    playAudio("/messages/messenger-notif-not-focus.mp3");
                } else {
                    playAudio("/messages/chat-audio-focus.mp3");
                }

                return {
                    ...oldData,
                    pages: oldData?.pages.map((page, idx) => {
                        if(idx === 0) {
                            return {
                                ...page,
                                messages: [message, ...page.messages],
                            }
                        }
                        return page
                    }),
                }
            });
        });

        return () => {
            socket.off('newMessage');
            console.log('Cleanup called');
            socket.disconnect();
        };
    }, [maintenanceId])

    const chatMessages = data?.pages.flatMap((page) =>
        page.messages
    ) || [];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Communication</CardTitle>
                <CardDescription>Group chat with tenant, landlord and assigned worker</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col h-[700px]">
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
                                openPhotoViewer={(photo) => setSelectedPhotos(photo || [])}
                                message={message}
                                key={message.id}
                                />
                            ))}
                        </InfiniteScroll>
                    </div>
                    
                    <MaintenanceMessageInput maintenanceId={maintenanceId} />
                </div>

                {/* Should be a component */}
                <MaintenancePhotoViewer selectedPhotos={selectedPhotos} clearPhoto={() => setSelectedPhotos([])} />
            </CardContent>
        </Card>
    )
}

export default MaintenanceChat