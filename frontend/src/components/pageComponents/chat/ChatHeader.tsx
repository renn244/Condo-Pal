import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Building2, ChevronLeft, MoreVertical } from "lucide-react"

type ChatHeaderProps = {
    setShowMobile: (show: boolean) => void
    selectedResident: any
}

const ChatHeader = ({
    setShowMobile: setShowMobileChat,
    selectedResident
}: ChatHeaderProps) => {
    return (
        <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileChat(false)}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="relative flex-shrink-0">
                    <Avatar>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {selectedResident.name.charAt(0)}
                        </div>
                    </Avatar>
                    {selectedResident.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                </div>

                <div>
                    <h3 className="font-medium">{selectedResident.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 mr-1" />
                        <span>{selectedResident.condo}</span>
                    </div>
                </div>
            </div>

            <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
            </Button>
        </div>
    )
}

export default ChatHeader