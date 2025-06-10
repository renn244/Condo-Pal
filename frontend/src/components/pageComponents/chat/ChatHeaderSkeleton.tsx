import ChatHeaderSkeleton from "@/components/skeleton/Message/ChatHeader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import useMessageParams from "@/hooks/useMessageParams"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { Building2, ChevronLeft } from "lucide-react"

type ChatHeaderProps = {
    setShowMobile: (show: boolean) => void
}

const ChatHeader = ({
    setShowMobile: setShowMobileChat,
}: ChatHeaderProps) => {
    const { leaseAgreementId } = useMessageParams();

    const { data: selectedChatInfo, isLoading, error } = useQuery({
        queryKey: ['getSelectedChatInfo', leaseAgreementId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/message/getSelectedChatInfo?leaseAgreementId=${leaseAgreementId}`)
            
            if(response.status === 404) {
                return null
            }

            if(response.status >= 400) {
                throw new Error("Error fetching chat info")
            }

            return response.data;
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) return <ChatHeaderSkeleton />

    if(!selectedChatInfo) return null

    if(error) return

    return (
        <div className="p-2.5 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileChat(false)}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="relative flex-shrink-0">
                    <Avatar>
                        <AvatarImage src={selectedChatInfo.profile} />
                        <AvatarFallback>{selectedChatInfo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {selectedChatInfo.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                </div>

                <div>
                    <h3 className="font-medium">{selectedChatInfo.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 mr-1" />
                        <span>{selectedChatInfo.condoName}, {selectedChatInfo.address}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader