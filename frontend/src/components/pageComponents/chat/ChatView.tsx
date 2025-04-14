import LoadingSpinner from "@/components/common/LoadingSpinner"
import { useAuthContext } from "@/context/AuthContext"
import formatSmartDate from "@/lib/formatSmartDate"
import { FetchNextPageOptions, InfiniteQueryObserverResult } from "@tanstack/react-query"
import { Eye } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"
import ChatDetailCard from "./ChatDetailCard"

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
                                    <div className="mt-2 space-y-2">
                                        {message.attachment.length <= 3 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {message.attachment.map((attachment, index) => (
                                                        <div
                                                        key={index}
                                                        className="relative cursor-pointer"
                                                        onClick={() => openPhotoViewer(message.attachment)}
                                                        >
                                                            <img
                                                            src={attachment || "/placeholder.svg"}
                                                            alt="Attachment"
                                                            className="max-h-40 rounded-md object-cover"
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="relative cursor-pointer">
                                                <div className="relative" onClick={() => openPhotoViewer(message.attachment)}>
                                                    <img
                                                    src={message.attachment[0] || "/placeholder.svg"}
                                                    alt="Attachment"
                                                    className="max-h-40 rounded-md object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                                                        <span className="text-white font-medium">+{message.attachment.length - 1} more</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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