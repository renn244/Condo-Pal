import { File } from "lucide-react"
import { useRef } from "react"

type ChatViewProps = {
    messages: any[],
    openPhotoViewer: (photos: string[]) => void
}

const ChatView = ({
    messages,
    openPhotoViewer,
}: ChatViewProps) => {
    const messageEndRef = useRef<HTMLDivElement>(null)

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <div
                key={message.id}
                className={`flex ${message.sender === "landlord" ? "justify-end" : "justify-start"}`}
                >
                    <div
                    className={`
                        max-w-[80%] rounded-lg p-3 space-y-1
                        ${message.sender === "landlord" ? "bg-primary text-primary-foreground" : "bg-muted"}
                    `}
                    >
                        {message.text && <p>{message.text}</p>}

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {message.attachments.length <= 3 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {message.attachments.map((attachment: any, index: number) =>
                                            attachment.type === "image" ? (
                                                <div
                                                key={index}
                                                className="relative cursor-pointer"
                                                onClick={() => openPhotoViewer(message.attachments)}
                                                >
                                                    <img
                                                    src={attachment.url || "/placeholder.svg"}
                                                    alt="Attachment"
                                                    className="max-h-40 rounded-md object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div key={index} className="flex items-center gap-2 p-2 bg-background rounded">
                                                    <File className="h-5 w-5" />
                                                    <span className="text-sm">Document</span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative cursor-pointer">
                                        <div className="relative" onClick={() => openPhotoViewer(message.attachments)}>
                                            <img
                                            src={message.attachments[0].url || "/placeholder.svg"}
                                            alt="Attachment"
                                            className="max-h-40 rounded-md object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                                                <span className="text-white font-medium">+{message.attachments.length - 1} more</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div
                        className={`text-xs ${message.sender === "landlord" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                        >
                            {message.timestamp}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messageEndRef} />
        </div>
    )
}

export default ChatView