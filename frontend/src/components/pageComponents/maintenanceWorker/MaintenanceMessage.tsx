import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthContext } from "@/context/AuthContext"
import formatDateTime from "@/lib/formatDateTime"
import { ImageIcon } from "lucide-react"

type MaintenanceMessageProps = {
    message: MaintenanceMessageWithSender,
    openPhotoViewer: (photos: string[]) => void
}

const MaintenanceMessage = ({
    message, 
    openPhotoViewer
}: MaintenanceMessageProps) => {
    const { user } = useAuthContext();
    const userId = user!.id

    return (
        <div
        key={message.id}
        className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
        >
            <div className={`flex gap-2 max-w-[80%] ${message.senderId === userId ? "flex-row-reverse" : "flex-row"}`}>
                {message.senderId !== "system" && (
                    <Avatar className={`h-8 w-8 ${message.senderId === userId ? "mt-2" : "mt-6"}`}>
                        <AvatarImage src={message.sender?.profile} alt={message.sender?.name} />
                        <AvatarFallback>{(message.sender?.name || message.workerName || "W").charAt(0)}</AvatarFallback>
                    </Avatar>
                )}

                <div className="my-1">
                    <div className={`flex items-center gap-2 mb-1 ${message.senderId === userId ? "justify-end" : "justify-start"}`}>
                        {message.senderId !== userId && (
                            <span className="text-xs font-medium">
                                {message.sender ? message.sender.name : message.workerName} {" "}
                                <span className="capitalize">({message.senderType.toLowerCase()})</span>
                            </span>
                        )}
                    </div>

                    {message?.message && (
                        <div
                        className={`p-1 px-2 rounded-lg ${
                        message.senderId === "system"
                            ? "bg-muted text-muted-foreground text-sm border"
                            : message.senderId === userId
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                        }`}
                        >
                            <p className="whitespace-pre-wrap">{message.message}</p>
                        </div>
                    )}
                    
                    {message.attachment && message.attachment.length > 0 && (
                        <div
                        className={`mt-2 ${message.senderId === userId ? "text-right" : "text-left"}`}
                        >
                            {message.attachment.length <= 3 ? (
                                <div
                                className={`flex flex-wrap gap-2 ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                                >
                                    {message.attachment.map((attachment, index) => (
                                    <div
                                    key={index}
                                    className="relative cursor-pointer"
                                    onClick={() => openPhotoViewer(message.attachment || [])}
                                    >
                                        <img
                                        src={attachment || "/placeholder.svg"}
                                        alt={`Attachment ${index + 1}`}
                                        className="h-24 w-24 object-cover rounded-md border"
                                        />
                                    </div>
                                    ))}
                                </div>
                                ) : (
                                <div
                                className={`flex items-center gap-2 cursor-pointer ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                                onClick={() => openPhotoViewer(message.attachment || [])}
                                >
                                    <div className="relative h-24 w-24">
                                        <img
                                        src={message.attachment[0] || "/placeholder.svg"}
                                        alt="First attachment"
                                        className="h-24 w-24 object-cover rounded-md border"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                            <div className="text-white font-medium">
                                                <ImageIcon className="h-5 w-5 mb-1 mx-auto" />+{message.attachment.length - 1} more
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`flex items-center gap-2 mt-1 select-none ${message.senderId === userId ? "justify-end" : "justify-start"}`}>
                        <span className="text-xs text-muted-foreground">{formatDateTime(new Date(message.createdAt))}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaintenanceMessage