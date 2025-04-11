import ChatHeader from "@/components/pageComponents/chat/ChatHeader"
import ChatInput from "@/components/pageComponents/chat/ChatInput"
import ChatView from "@/components/pageComponents/chat/ChatView"
import ConversationList from "@/components/pageComponents/chat/ConversationList"
import MaintenancePhotoViewer from "@/components/pageComponents/maintenanceWorker/MaintenancePhotoViewer"
import axiosFetch from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"

// Mock data for residents
const residents = [
    {
      id: 1,
      name: "John Smith",
      condo: "Palm Residences #1201",
      online: true,
      unreadCount: 3,
      lastMessage: "When will the water interruption end?",
      lastMessageTime: "10:42 AM",
    },
    {
      id: 2,
      name: "Maria Garcia",
      condo: "Palm Residences #803",
      online: false,
      unreadCount: 0,
      lastMessage: "Thank you for addressing the noise complaint.",
      lastMessageTime: "Yesterday",
    },
    {
      id: 3,
      name: "Robert Chen",
      condo: "Maple Tower #2204",
      online: true,
      unreadCount: 1,
      lastMessage: "Is the gym open during the holiday?",
      lastMessageTime: "Yesterday",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      condo: "Maple Tower #1105",
      online: false,
      unreadCount: 0,
      lastMessage: "I've submitted the maintenance request.",
      lastMessageTime: "Monday",
    },
    {
      id: 5,
      name: "David Kim",
      condo: "Oak Residences #501",
      online: true,
      unreadCount: 0,
      lastMessage: "When is the next association meeting?",
      lastMessageTime: "Monday",
    },
]

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
  const [selectedResident, setSelectedResident] = useState(residents[0])
  const [messages] = useState(initialMessages)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [viewingPhotos, setViewingPhotos] = useState<string[]>([])

  const { mutate, isPending } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async ({ message, attachments }: { message: string, attachments: File[] }) => {
      // make it multiform
      // const response = await axiosFetch.post(`/chat/send/${selectedResident.id}`, {
      //     message,
      //     attachments
      // })
    },
    onSuccess: (data) => {
      // update the query here
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

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
        conversationList={residents}
        selectedResidentId={selectedResident.id.toString()}
        setSelectedResidentId={setSelectedResident as any} 
        />

        <div className={`w-full md:w-2/3 flex flex-col ${showMobileChat ? "flex" : "hidden md:flex"}`}>
          <ChatHeader setShowMobile={setShowMobileChat} selectedResident={selectedResident} />

          <ChatView messages={messages} openPhotoViewer={openPhotoViewer} />

          <ChatInput isLoading={isPending} 
          sendMessage={(message, attachments) => mutate({ message, attachments })}  />
        </div>
      </div>

      {/* Photo Viewer */}
      <MaintenancePhotoViewer selectedPhotos={viewingPhotos} clearPhoto={() => setViewingPhotos([])} />
    </div>
  )
}

export default Chat