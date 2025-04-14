import ConversationList from "@/components/pageComponents/chat/ConversationList"
import ChatInputLandlord from "@/components/pageComponents/dashboard/chat/ChatInputLandlord"
import ChatListAndHeader from "@/components/pageComponents/dashboard/chat/ChatListAndHeader"
import MaintenancePhotoViewer from "@/components/pageComponents/maintenanceWorker/MaintenancePhotoViewer"
import useMessageParams from "@/hooks/useMessageParams"
import { MessageSquare } from "lucide-react"
import { useState } from "react"


const Chat = () => {
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [viewingPhotos, setViewingPhotos] = useState<string[]>([])
  const { leaseAgreementId } = useMessageParams();

  // Open photo viewer
  const openPhotoViewer = (photos: string[]) => {
    setViewingPhotos(photos)
  }

  return (
    <div className="h-full">
      <div className="flex flex-1 h-full max-h-[843px]">
        <ConversationList 
        showMobileChat={showMobileChat}
        setShowMobileChat={setShowMobileChat}
        />

        <div className={`w-full md:w-full flex flex-col ${showMobileChat ? "flex" : "hidden md:flex"}`}>
          {leaseAgreementId ? (
            <>
              <ChatListAndHeader 
              openPhotoViewer={openPhotoViewer}
              setShowMobileChat={setShowMobileChat}
              />

              <ChatInputLandlord />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
              <p className="text-muted-foreground max-w-md">
                Please select a resident from the list to start chatting or continue a conversation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Photo Viewer */}
      <MaintenancePhotoViewer selectedPhotos={viewingPhotos} clearPhoto={() => setViewingPhotos([])} />
    </div>
  )
}

export default Chat