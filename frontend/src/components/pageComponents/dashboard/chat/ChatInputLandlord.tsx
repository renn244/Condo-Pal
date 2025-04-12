import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ChatInput from "../../chat/ChatInput";
import { toFormData } from "axios";
import axiosFetch from "@/lib/axios";

type ChatInputLandlordProps = {
    
}

const ChatInputLandlord = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationKey: ["sendMessage"],
        mutationFn: async ({ message, attachments }: { message: string, attachments: File[] }) => {
            const formData = toFormData({ message });
            attachments.forEach((file) => formData.append("attachments", file));

            const response = await axiosFetch.post(`/message/send-message?leaseAgreementId=${'leaseAgreementId'}&receiverId=${'receiver'}`, {
                message,
                attachments
            })

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data;
        },
        onSuccess: (data) => {
            //update the query here
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    return (
        <ChatInput isLoading={isPending} 
        sendMessage={(message, attachments) => mutate({ message, attachments })}  />
    )
}

export default ChatInputLandlord