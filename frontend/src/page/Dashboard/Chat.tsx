import ChatHeader from "@/components/pageComponents/chat/ChatHeader"
import ChatView from "@/components/pageComponents/chat/ChatView"
import ConversationList from "@/components/pageComponents/chat/ConversationList"
import ChatInputLandlord from "@/components/pageComponents/dashboard/chat/ChatInputLandlord"
import MaintenancePhotoViewer from "@/components/pageComponents/maintenanceWorker/MaintenancePhotoViewer"
import { useState } from "react"

// Mock chat messages
const initialMessages = [
    {
      id: 1,
      sender: "resident",
      text: "Hello, I wanted to ask about the scheduled maintenance for the elevators next week.",
      timestamp: "10:30 AM",
      read: true,
    },
    {
      id: 2,
      sender: "landlord",
      text: "Hi John, the elevator maintenance is scheduled for Tuesday from 10 AM to 2 PM. We'll have one elevator operational at all times.",
      timestamp: "10:35 AM",
      read: true,
    },
    {
      id: 3,
      sender: "resident",
      text: "Thanks for the information. Will there be any other maintenance work happening next week?",
      timestamp: "10:38 AM",
      read: true,
    },
    {
      id: 4,
      sender: "landlord",
      text: "There's also scheduled water interruption on Thursday from 1 PM to 4 PM for pipe maintenance on floors 10-15.",
      timestamp: "10:40 AM",
      read: true,
    },
    {
      id: 5,
      sender: "resident",
      text: "When will the water interruption end?",
      timestamp: "10:42 AM",
      read: false,
      attachments: [{ type: "image", url: "/placeholder.svg?height=400&width=600" }],
    },
]

const Chat = () => {
  const [messages] = useState(initialMessages)
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
          <ChatHeader setShowMobile={setShowMobileChat} />

          <ChatView messages={messages} openPhotoViewer={openPhotoViewer} />

          <ChatInputLandlord />
        </div>
      </div>

      {/* Photo Viewer */}
      <MaintenancePhotoViewer selectedPhotos={viewingPhotos} clearPhoto={() => setViewingPhotos([])} />
    </div>
  )
}

export default Chat