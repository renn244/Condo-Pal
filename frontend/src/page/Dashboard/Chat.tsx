import ConversationList from "@/components/pageComponents/chat/ConversationList"
import ChatInputLandlord from "@/components/pageComponents/dashboard/chat/ChatInputLandlord"
import ChatListAndHeader from "@/components/pageComponents/dashboard/chat/ChatListAndHeader"
import MaintenancePhotoViewer from "@/components/pageComponents/maintenanceWorker/MaintenancePhotoViewer"
import { useState } from "react"


const Chat = () => {
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [viewingPhotos, setViewingPhotos] = useState<string[]>([])

  // Open photo viewer
  const openPhotoViewer = (photos: string[]) => {
    setViewingPhotos(photos)
  }

  return (
    <div className="h-full">
      <div className="flex flex-1 h-full max-h-screen">
        <ConversationList 
        showMobileChat={showMobileChat}
        setShowMobileChat={setShowMobileChat}
        />

        <div className={`w-full md:w-2/3 flex flex-col ${showMobileChat ? "flex" : "hidden md:flex"}`}>
          <ChatListAndHeader 
          openPhotoViewer={openPhotoViewer}
          setShowMobileChat={setShowMobileChat}
          />

          <ChatInputLandlord />
        </div>
      </div>

      {/* Photo Viewer */}
      <MaintenancePhotoViewer selectedPhotos={viewingPhotos} clearPhoto={() => setViewingPhotos([])} />
    </div>
  )
}

export default Chat