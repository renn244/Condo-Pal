import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X, File } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";
import toast from "react-hot-toast";

type previewTypes = {
    isImage: boolean;
    url: string;
    name?: string;
}

type ChatInputProps = {
    sendMessage: (message: string, attachments: File[]) => void;
    isLoading: boolean;
    newMessage: string,
    setNewMessage: (message: string) => void;
    attachments: File[];
    setAttachments: (attachments: File[]) => void;
    previewAttachments: previewTypes[];
    setPreviewAttachments: Dispatch<SetStateAction<previewTypes[]>>;
}

const ChatInput = ({
    sendMessage,
    isLoading,
    newMessage,
    setNewMessage,
    attachments,
    setAttachments,
    previewAttachments,
    setPreviewAttachments,
}: ChatInputProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const newFiles = Array.from(e.target.files);
            setAttachments([...attachments, ...newFiles]);

            newFiles.forEach((file) => {
                const reader = new FileReader();

                const MAX_SIZE = 10 * 1024 * 1024; // 10MB
                if(MAX_SIZE < file.size) {
                    toast.error("Some files are too large!");
                    return;
                } 

                reader.onloadend = () => {
                    const previewUrl = reader.result as string;
                    setPreviewAttachments(prev => [
                        ...prev, 
                        { isImage: file.type.startsWith("image/"), url: previewUrl, name: file.name }
                    ]);
                }
                reader.readAsDataURL(file);
            })

            e.target.value = ""; // reset the input file because if no file change then it won't trigger the onChange event again
        }
    }

    const removeAttachment = (index: number) => {
        URL.revokeObjectURL(previewAttachments[index].url);        
        setAttachments(attachments.filter((_, i) => i !== index));
        setPreviewAttachments(previewAttachments.filter((_, i) => i !== index));
    }

    return (
        <>
            {/* Attachment preview */}
            {previewAttachments.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-2 mx-2">
                    {previewAttachments?.map((preview, index) => (
                        <div className="relative" key={index}>
                            {preview.isImage ? (
                                <div className="relative h-16 w-16">
                                    <img
                                    src={preview.url || "/placeholder.svg"}
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
                            ) : (
                                <div className="relative w-auto h-10 bg-muted rounded flex items-center px-2">
                                    <File className="h-6 w-6" />
                                    <span className="ml-2 text-sm text-black font-medium truncate">{preview.name}</span>
                                    <button
                                    className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 shadow"
                                    onClick={() => removeAttachment(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
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
                <Input type="file" accept="image" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />


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