import { useInfiniteQuery } from "@tanstack/react-query"
import ChatHeader from "../../chat/ChatHeader"
import ChatView from "../../chat/ChatView"
import axiosFetch from "@/lib/axios"
import { useEffect } from "react"
import { useSocketContext } from "@/context/SocketContext"

type ChatListAndHeaderProps = {
    messages: any[]
    openPhotoViewer: (photos: string[]) => void
    selectedResident: any
    setShowMobileChat: (show: boolean) => void
}

const ChatListAndHeader = ({
    messages,
    openPhotoViewer,
    selectedResident,
    setShowMobileChat,
}: ChatListAndHeaderProps) => {
    const { socket } = useSocketContext();

    const { 
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["chatMessages"],
        queryFn: async ({ pageParam: cursor = null }) => {
            const response = await axiosFetch.get(`/message/getMessages?leaseAgreementId=${'leaseAgreementId'}&cursor=${cursor}`)

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return [] as any;
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

    return (
        <>
            <ChatHeader setShowMobile={setShowMobileChat} selectedResident={selectedResident} />
            <ChatView messages={messages} openPhotoViewer={openPhotoViewer} />
        </>
    )
}

export default ChatListAndHeader