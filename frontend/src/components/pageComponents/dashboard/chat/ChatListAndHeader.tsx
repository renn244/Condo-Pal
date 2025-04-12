import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query"
import ChatHeader from "../../chat/ChatHeader"
import ChatView from "../../chat/ChatView"
import axiosFetch from "@/lib/axios"
import { useEffect } from "react"
import { useSocketContext } from "@/context/SocketContext"
import useMessageParams from "@/hooks/useMessageParams"

type ChatListAndHeaderProps = {
    openPhotoViewer: (photos: string[]) => void
    setShowMobileChat: (show: boolean) => void
}

const ChatListAndHeader = ({
    openPhotoViewer,
    setShowMobileChat,
}: ChatListAndHeaderProps) => {
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

        socket.on("newMessageCondo", async (message: any) => {
            // update the chatMessages query here
        })
        
        return () => {
            socket.off("newMessageCondo");
        }
    }, [socket])

    const messages = data?.pages.flatMap((page) => page.messages || []) || [];

    return (
        <>
            <ChatHeader setShowMobile={setShowMobileChat} />
            <ChatView messages={messages} openPhotoViewer={openPhotoViewer} 
            hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
        </>
    )
}

export default ChatListAndHeader