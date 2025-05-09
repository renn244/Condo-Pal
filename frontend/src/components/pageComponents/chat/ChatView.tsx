import LoadingSpinner from "@/components/common/LoadingSpinner"
import { useAuthContext } from "@/context/AuthContext"
import formatSmartDate from "@/lib/formatSmartDate"
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "@tanstack/react-query"
import { Eye } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"
import ChatDetailCard from "./ChatDetailCard"
import ChatAttachments from "./ChatAttachments"

type ChatViewProps = {
    messages: messageswithSender,
    openPhotoViewer: (photos: string[]) => void,
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult>,
    hasNextPage: boolean,
}

const ChatView = ({
    messages,
    openPhotoViewer,
    fetchNextPage,
    hasNextPage,
}: ChatViewProps) => {
    const { user } = useAuthContext();
    const userId = user!.id;

    // get the last message seen
    const lastMessageSeen = messages
        .filter((message) => message.isRead && message.senderId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return (
        <div id="messageContainer" className="flex-1 overflow-y-auto flex flex-col-reverse">
            <InfiniteScroll
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
            dataLength={messages.length}
            next={() => fetchNextPage()}
            hasMore={hasNextPage}
            inverse={true}
            scrollableTarget={"messageContainer"}
            loader={<div className="flex justify-center"><LoadingSpinner /></div>}
            endMessage={<ChatDetailCard />}
            >
                {messages.map((message) => (
                    <div
                    key={message.id}
                    className={`flex mb-2 ${userId === message.senderId ? "justify-end mr-1" : "justify-start ml-2"}`}
                    >
                        <div className="max-w-[80%]">
                            <div
                            className={`
                                rounded-lg p-3 space-y-1
                                ${userId === message.senderId ? "bg-primary text-primary-foreground" : "bg-muted"}
                            `}
                            >
                                {message.message && <p>{message.message}</p>}

                                {/* Attachments */}
                                {message.attachment && message.attachment.length > 0 && (
                                    <ChatAttachments openPhotoViewer={openPhotoViewer} attachments={message.attachment} />
                                )}

                                <div
                                className={`text-xs ${userId === message.senderId  ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                                >
                                    {formatSmartDate(new Date(message.createdAt))}
                                </div>
                            </div>
                            {(lastMessageSeen?.id === message.id && message.senderId === userId) && (
                                <div className={`w-full flex justify-end`}>
                                    <Eye className={`h-4 w-4 text-primary`} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    )
}

export default ChatView