import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useMessageParams from "@/hooks/useMessageParams"
import axiosFetch from "@/lib/axios";
import formatDate from "@/lib/formatDate";
import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";

const ChatDetailCard = () => {
    const { leaseAgreementId } = useMessageParams();

    const { data: selectedUserInfo, isLoading } = useQuery({
        queryKey: ["chatDetails", leaseAgreementId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/message/getSelectedChatInfo?leaseAgreementId=${leaseAgreementId}`)
            
            if(response.status === 404) {
                return null
            }

            if(response.status >= 400) {
                throw new Error("Error fetching chat info")
            }

            return response.data;
        }
    })

    if(isLoading) {
        return null
    }

    return (
        <div className="bg-muted/30 rounded-lg p-4 mb-6 mx-4 mt-3 border">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUserInfo.profile} />
                    <AvatarFallback>{selectedUserInfo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold">{selectedUserInfo.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                        <p className="flex items-center justify-center sm:justify-start">
                            <Building2 className="h-3.5 w-3.5 mr-1.5" />
                            <span>{selectedUserInfo.condoName}</span>
                        </p>
                        <p>{selectedUserInfo.address}</p>
                        <p>Lease started: {formatDate(new Date(selectedUserInfo.leaseStart))}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatDetailCard