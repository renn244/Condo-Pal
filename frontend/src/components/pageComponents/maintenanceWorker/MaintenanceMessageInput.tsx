import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send } from "lucide-react"
import { useState } from "react"

const MaintenanceMessageInput = () => {
    const [newMessage, setNewMessage] = useState("");

    // send data here

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="icon" type="button">
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
            </Button>
            <Input type="file" className="hidden" multiple />

            <Textarea
            placeholder="Type your message..."
            className="flex-1 min-h-[40px] resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                }
            }}
            />

            <Button
            type="button"
            size="icon"
            disabled={newMessage.trim() === ""}
            >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
            </Button>
        </div>
    )
}

export default MaintenanceMessageInput