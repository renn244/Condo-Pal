import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ChatInput from "../../chat/ChatInput";
import { toFormData } from "axios";
import axiosFetch from "@/lib/axios";
import useMessageParams from "@/hooks/useMessageParams";
import { useState } from "react";

const ChatInputLandlord = () => {
    const [newMessage, setNewMessage] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [previewAttachments, setPreviewAttachments] = useState<string[]>([]);

    const queryClient = useQueryClient();
    const { leaseAgreementId } = useMessageParams();

    const { mutate, isPending } = useMutation({
        mutationKey: ["sendMessage"],
        mutationFn: async ({ message, attachments }: { message: string, attachments: File[] }) => {
            const formData = toFormData({ message });
            attachments.forEach((file) => formData.append("attachments", file));

            const receiverId = (queryClient.getQueryData(["conversationList", ""]) as conversationList)
            ?.find((chat) => chat.id === leaseAgreementId)?.sender.id;

            const response = await axiosFetch.post(
                `/message/send-message?leaseAgreementId=${leaseAgreementId}&receiverId=${receiverId}`, 
                formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data;
        },
        onSuccess: (data) => {
            setNewMessage("");
            setAttachments([]);
            setPreviewAttachments([]);

            //update the query here
            queryClient.setQueryData(["chatMessages", leaseAgreementId], (oldData: InfiniteData<getMessageRequest>) => {
                return {
                    ...oldData,
                    pages: oldData.pages.map((page, idx) => {
                        if(idx === 0) {
                            return {
                                ...page,
                                messages: [data, ...page.messages],
                            }
                        }
                        return page;
                    })
                }
            })
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
    
    return (
        <ChatInput isLoading={isPending} 
        newMessage={newMessage} setNewMessage={setNewMessage}
        attachments={attachments} setAttachments={setAttachments}
        previewAttachments={previewAttachments} setPreviewAttachments={setPreviewAttachments}
        sendMessage={(message, attachments) => mutate({ message, attachments })}  />
    )
}

export default ChatInputLandlord