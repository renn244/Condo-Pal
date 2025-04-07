import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/context/AuthContext"
import formatDateTime from "@/lib/formatDateTime"
import { CheckCircle, Clock, ImageIcon } from "lucide-react"

type MaintenanceMessageProps = {
    message: MaintenanceMessageWithSender,
    openPhotoViewer: (photos: string[]) => void
}

const MaintenanceMessage = ({
    message, 
    openPhotoViewer
}: MaintenanceMessageProps) => {
    const { user } = useAuthContext();
    const userId = user?.id || sessionStorage.getItem("workerName") || "";

    const isMyMessage = user?.id ? message.senderId === userId : message.workerName === userId;

    return (
        message.isStatusUpdate ? (
            // Status Update Message
            <div className="flex justify-center my-4">
                <div className="bg-muted/20 border border-muted rounded-md px-6 py-3 text-center min-w-[40%] max-w-[85%] shadow-md">
                    <h1 className="font-bold text-lg text-muted-foreground mb-1">
                        Status Updated
                    </h1>
                    {message.statusUpdate === "IN_PROGRESS" && (
                        <div className="flex justify-center items-center mb-2 gap-2">
                            <div className="bg-purple-100 text-purple-800 p-1 rounded-md">
                                <Clock className="h-4 w-4" />
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                                In Progress
                            </Badge>
                        </div>
                    )}
                    {message.statusUpdate === 'COMPLETED' && (
                        <div className="flex justify-center items-center mb-2 gap-2">
                            <div className="bg-green-100 text-green-800 p-1 rounded-md">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                Completed
                            </Badge>
                        </div>
                    )}

                    <p className="text-sm font-medium whitespace-pre-wrap">
                        {message.message}
                    </p>

                    {message.attachment && message.attachment.length > 0 && (
                        <div className="mt-1 flex justify-center">
                            {message.attachment.length <= 3 ? (
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {message.attachment.map((attachment, index) => (
                                        <div
                                        key={index}
                                        className="relative cursor-pointer"
                                        onClick={() => openPhotoViewer(message.attachment || [])}
                                        >
                                            <img
                                            src={attachment || "/placeholder.svg"}
                                            alt={`Attachment ${index + 1}`}
                                            className="h-20 w-20 object-cover rounded-md border"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                className="flex items-center gap-2 cursor-pointer justify-center"
                                onClick={() => openPhotoViewer(message.attachment || [])}
                                >
                                    <div className="relative h-20 w-20">
                                        <img
                                        src={message.attachment[0] || "/placeholder.svg"}
                                        alt="First attachment"
                                        className="h-20 w-20 object-cover rounded-md border"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                            <div className="text-white font-medium">
                                                <ImageIcon className="h-5 w-5 mb-1 mx-auto" />+{message.attachment.length - 1}{" "}
                                                more
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{formatDateTime(new Date(message.createdAt))}</span>
                    </div>
                </div>
            </div>
        ) : (
            // Regular Message
            <div
            key={message.id}
            className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
            >
                <div className={`flex gap-2 max-w-[80%] ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                    {message.senderId !== "system" && (
                        <Avatar className={`h-8 w-8 ${isMyMessage ? message.senderType === 'WORKER' ? "mt-6" : "mt-2" : "mt-6"}`}>
                            <AvatarImage src={message.sender?.profile} alt={message.sender?.name} />
                            <AvatarFallback>{(message.sender?.name || message.workerName || "W").charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}

                    <div className="my-1">
                        <div className={`flex items-center gap-2 mb-1 ${isMyMessage ? "justify-end" : "justify-start"}`}>
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
                                : isMyMessage
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                            >
                                <p className="whitespace-pre-wrap">{message.message}</p>
                            </div>
                        )}
                        
                        {message.attachment && message.attachment.length > 0 && (
                            <div
                            className={`mt-2 ${isMyMessage ? "text-right" : "text-left"}`}
                            >
                                {message.attachment.length <= 3 ? (
                                    <div
                                    className={`flex flex-wrap gap-2 ${isMyMessage ? "justify-end" : "justify-start"}`}
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
                                    className={`flex items-center gap-2 cursor-pointer ${isMyMessage ? "justify-end" : "justify-start"}`}
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

                        <div className={`flex items-center gap-2 mt-1 select-none ${isMyMessage ? "justify-end" : "justify-start"}`}>
                            <span className="text-xs text-muted-foreground">{formatDateTime(new Date(message.createdAt))}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}

export default MaintenanceMessage