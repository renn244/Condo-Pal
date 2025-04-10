import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { toFormData } from "axios"
import { Paperclip, Send, X } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router-dom"

type MaintenanceMessageInputProps = {
    maintenanceId: string
}

const MaintenanceMessageInput = ({
    maintenanceId
}: MaintenanceMessageInputProps) => {
    const [newMessage, setNewMessage] = useState("");
    const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: sendMessage, isPending } = useMutation({
        mutationKey: ['maintenance-message', 'sendMessage', maintenanceId],
        mutationFn: async () => {
            const formData = toFormData({ message: newMessage, token: token })
            attachments.forEach((file) => formData.append("attachments", file));
            
            const response = await axiosFetch.post(`/maintenance-message/sendMessage?maintenanceId=${maintenanceId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            )

            if(response.status >= 400) {
                throw new Error("Error sending message");
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            setNewMessage("");
            setAttachments([]);
            setAttachmentPreviews([]);
        }
    })

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setAttachments([...attachments, ...newFiles])

            newFiles.forEach((file) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setAttachmentPreviews((prev) => [...prev, reader.result as string])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index))
        setAttachmentPreviews(attachmentPreviews.filter((_, i) => i !== index))
    }
    
    return (
        <>
            {/* Attachment Previews */}
            {attachmentPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {attachmentPreviews.map((preview, index) => (
                        <div key={index} className="relative h-16 w-16">
                            <img
                            src={preview || "/placeholder.svg"}
                            alt={`Attachment preview ${index + 1}`}
                            className="h-16 w-16 object-cover rounded-md border"
                            />
                            <button
                            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center"
                            onClick={() => removeAttachment(index)}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Message Input */}
            <div className="flex gap-2">
                <Button variant="outline" size="icon" type="button" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                </Button>
                <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />

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
                disabled={(newMessage.trim() === "" && attachments.length === 0) || isPending}
                onClick={() => sendMessage()}
                >
                    {isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send message</span>
                        </>
                    )}
                </Button>
            </div>
        </>
    )
}

export default MaintenanceMessageInput