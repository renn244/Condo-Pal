import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { Paperclip, Send } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

type MaintenanceMessageInputProps = {
    maintenanceId: string
}

const MaintenanceMessageInput = ({
    maintenanceId
}: MaintenanceMessageInputProps) => {
    const [newMessage, setNewMessage] = useState("");

    // send data here
    const { mutate: sendMessage, isPending } = useMutation({
        mutationKey: ['maintenance-message', 'sendMessage', maintenanceId],
        mutationFn: async () => {
            const response = await axiosFetch.post(`/maintenance-message/sendMessage?maintenanceId=${maintenanceId}`, {
                message: newMessage,
            })

            if(response.status >= 400) {
                throw new Error("Error sending message");
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            setNewMessage("");
            // update the query cache here
        }
    })

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
                    if (newMessage.trim() !== "") {
                        sendMessage();
                    }
                }
            }}
            />

            <Button
            type="button"
            size="icon"
            disabled={newMessage.trim() === "" || isPending}
            onClick={() => sendMessage()}
            >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
            </Button>
        </div>
    )
}

export default MaintenanceMessageInput