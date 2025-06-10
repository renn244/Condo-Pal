import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import ChatHeader from "../../chat/ChatHeaderSkeleton"
import ChatView from "../../chat/ChatView"
import axiosFetch from "@/lib/axios"
import { useEffect } from "react"
import { useSocketContext } from "@/context/SocketContext"
import useMessageParams from "@/hooks/useMessageParams"
import { playAudio } from "@/lib/playAudio"

type ChatListAndHeaderProps = {
    openPhotoViewer: (photos: string[]) => void
    setShowMobileChat: (show: boolean) => void
}

const ChatListAndHeader = ({
    openPhotoViewer,
    setShowMobileChat,
}: ChatListAndHeaderProps) => {
    const queryClient = useQueryClient();
    const { socket } = useSocketContext();
    const { leaseAgreementId } = useMessageParams();

    const { 
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery<getMessageRequest, Error, InfiniteData<getMessageRequest>, ['chatMessages', string], string | null>({
        queryKey: ["chatMessages", leaseAgreementId],
        queryFn: async ({ pageParam: cursor = null }) => {
            const response = await axiosFetch.get(`/message/getMessages?leaseAgreementId=${leaseAgreementId}&cursor=${cursor || ''}`)

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data as getMessageRequest;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    useEffect(() => {
        if(!socket) return;

        // for sender when all messages are seen by the receiever
        socket.on("seenAllMessagesCondo", async (data: { leaseAgreementId: string }) => {
            if(data.leaseAgreementId !== leaseAgreementId) return; // ignore messages from other chats

            await queryClient.setQueryData(['chatMessages', leaseAgreementId], (oldData: InfiniteData<getMessageRequest>) => {
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => {
                        return {
                            ...page,
                            messages: page.messages.map((message) => {
                                return {
                                    ...message,
                                    isRead: true,
                                }
                            })
                        }
                    })
                }
            })
        })

        // this is for the sender to update the seen message
        socket.on("seenMessageCondo", async (data: { leaseAgreementId: string, messageId: string }) => {
            if(data.leaseAgreementId !== leaseAgreementId) return; // ignore messages from other chats

            await queryClient.setQueryData(['chatMessages', leaseAgreementId], (oldData: InfiniteData<getMessageRequest>) => {
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => {
                        return {
                            ...page,
                            messages: page.messages.map((message) => {
                                if(message.id === data.messageId) {
                                    return {
                                        ...message,
                                        isRead: true,
                                    }
                                }
                                return message;
                            })
                        }
                    })
                }
            })
        })

        // this is for the receiver
        socket.on("newMessageCondo", async (message: any) => {
            if(message.leaseAgreementId !== leaseAgreementId) return; // ignore messages from other chats
            
            // notitication
            if(document.hidden) {
                playAudio("/messages/messenger-notif-not-focus.mp3");
            } else {
                playAudio("/messages/chat-audio-focus.mp3");
            }

            // update the seen message
            socket.emit("seenMessageCondo", {
                leaseAgreementId,
                messageId: message.id,
                senderId: message.senderId
            })

            // there is a bug here if we chat with same account but (that shouldn't happen of course)
            await queryClient.setQueryData(['chatMessages', leaseAgreementId], (oldData: InfiniteData<getMessageRequest>) => {

                return {
                    ...oldData,
                    pages: oldData.pages.map((page, idx) => {
                        if(idx === 0) {
                            return {
                                ...page,
                                messages: [message, ...page.messages],
                            }
                        }
                        return page;
                    })
                }
            })
        })
        
        return () => {
            socket.off("seenAllMessagesCondo");
            socket.off("seenMessageCondo");
            socket.off("newMessageCondo");
        }
    }, [socket, leaseAgreementId])

    const messages = data?.pages.flatMap((page) => page.messages) || [];

    return (
        <>
            <ChatHeader setShowMobile={setShowMobileChat} />
            <ChatView
            messages={messages} openPhotoViewer={openPhotoViewer} 
            hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
        </>
    )
}

export default ChatListAndHeader