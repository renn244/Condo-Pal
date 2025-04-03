import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/context/AuthContext"
import formatDateTime from "@/lib/formatDateTime"

type MaintenanceMessageProps = {
    message: any,
}
  
enum UserRole {
    WORKER = "WORKER",
    TENANT = "TENANT",
    LANDLORD = "LANDLORD",
}

const MaintenanceMessage = ({
    message, 
}: MaintenanceMessageProps) => {
    const { user } = useAuthContext();
    const userId = user!.id

    return (
        <div
        key={message.id}
        className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
        >
            <div
            className={`flex gap-2 max-w-[80%] ${message.senderId === userId ? "flex-row-reverse" : "flex-row"}`}
            >
                {message.senderId !== "system" && (
                    <Avatar className="h-8 w-8 mt-6">
                        <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                        <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}

                <div>
                    <div
                    className={`flex items-center gap-2 mb-1 ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                    >
                        <span className="text-xs font-medium">
                        {message.senderId === "system" ? "System" : message.senderName}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDateTime(new Date(message.timestamp))}</span>
                        {message.senderId !== userId && (
                            <Badge variant="outline" className="text-xs">
                                {message.senderRole === UserRole.TENANT ? "Tenant" : "Landlord"}
                            </Badge>
                        )}
                    </div>

                    <div
                    className={`p-3 rounded-lg ${
                    message.senderId === "system"
                        ? "bg-muted text-muted-foreground text-sm border"
                        : message.senderId === userId
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                    }`}
                    >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {message.attachments && message.attachments.length > 0 && (
                        <div className={`flex flex-wrap gap-2 mt-2 ${message.senderId === userId ? "justify-end" : "justify-start"}`}>
                            {message.attachments.map((attachment: any, index: number) => (
                                <img
                                key={index}
                                src={attachment || "/placeholder.svg"}
                                alt={`Attachment ${index + 1}`}
                                className="h-24 w-24 object-cover rounded-md border"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MaintenanceMessage