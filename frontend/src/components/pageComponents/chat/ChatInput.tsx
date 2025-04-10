import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X } from "lucide-react";
import { useRef, useState } from "react";

type ChatInputProps = {
    sendMessage: (message: string, attachments: File[]) => void;
    isLoading: boolean;
}

const ChatInput = ({
    sendMessage,
    isLoading
}: ChatInputProps) => {
    const [newMessage, setNewMessage] = useState("")
    const [attachments, setAttachments] = useState<File[]>([])
    const [previewAttachments, setPreviewAttachments] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const newFiles = Array.from(e.target.files);
            setAttachments([...attachments, ...newFiles]);

            newFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const previewUrl = reader.result as string;
                    setPreviewAttachments((prev) => [...prev, previewUrl]);
                }
                reader.readAsDataURL(file);
            })
        }
    }

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
        setPreviewAttachments(previewAttachments.filter((_, i) => i !== index));
    }

    return (
        <>
            {/* Attachment preview */}
            {previewAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {previewAttachments.map((preview, index) => (
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

            {/* Message input */}
            <div className="p-3 border-t flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-5 w-5" />
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
                            sendMessage(newMessage, attachments);
                        }
                    }
                }}
                />

                <Button
                size="icon"
                onClick={() => sendMessage(newMessage, attachments)}
                disabled={newMessage.trim() === "" && attachments.length === 0 || isLoading}
                >
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            <span className="sr-only">Send message</span>
                        </>
                    )}
                </Button>
            </div>
        </>
    )
}

export default ChatInput