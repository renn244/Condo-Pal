import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

type ConversationListProps = {
    showMobileChat: boolean
    setShowMobileChat: (show: boolean) => void
    conversationList: any[],
    selectedResidentId?: string,
    setSelectedResidentId: (residentId: string) => void,
}

const ConversationList = ({
    showMobileChat,
    setShowMobileChat,
    conversationList,
    selectedResidentId,
    setSelectedResidentId
}: ConversationListProps) => {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <div className={`w-full h-full md:w-1/4 border-r flex flex-col ${showMobileChat ? "hidden md:flex" : "flex"}`}>
            <div className="p-3 border-b">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search residents..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversationList.map((resident) => (
                    <div
                    key={resident.id}
                    className={`
                        flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors
                        ${selectedResidentId === resident.id && "bg-muted"}
                    `}
                    onClick={() => {
                        setSelectedResidentId(resident) // this should be a parameter
                        setShowMobileChat(true)
                    }}
                    >
                        <div className="relative flex-shrink-0">
                        <Avatar>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                {resident.name.charAt(0)}
                            </div>
                        </Avatar>
                        {resident.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                        )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-medium truncate">{resident.name}</h3>
                                <span className="text-xs text-muted-foreground">{resident.lastMessageTime}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{resident.condo}</p>
                            <p className="text-sm truncate">{resident.lastMessage}</p>
                        </div>

                        {resident.unreadCount > 0 && (
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-medium">
                                {resident.unreadCount}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ConversationList