import LoadingSpinner from "@/components/common/LoadingSpinner"
import NotFound from "@/components/common/NotFound"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import MaintenanceDetails from "@/components/pageComponents/maintenanceWorker/MaintenanceDetails"
import MaintenanceMessage from "@/components/pageComponents/maintenanceWorker/MaintenanceMessage"
import MaintenanceMessageInput from "@/components/pageComponents/maintenanceWorker/MaintenanceMessageInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

  
enum UserRole {
    WORKER = "WORKER",
    TENANT = "TENANT",
    LANDLORD = "LANDLORD",
}

const sampleChatMessages = [
    {
      id: "msg-1",
      senderId: "tenant-1",
      senderName: "Alice Johnson",
      senderRole: UserRole.TENANT,
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Hi, I've submitted a maintenance request for my leaking kitchen faucet. It's getting worse.",
      timestamp: "2024-03-20T09:15:00Z",
      attachments: [],
    },
    {
      id: "msg-2",
      senderId: "landlord-1",
      senderName: "John Smith",
      senderRole: UserRole.LANDLORD,
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Thanks for reporting this. I've assigned Mike to fix this issue. He'll be there on March 30th.",
      timestamp: "2024-03-21T10:30:00Z",
      attachments: [],
    },
    {
      id: "msg-3",
      senderId: "cm794dtf2000ah80v5ls32jb4",
      senderName: "Mike Rodriguez",
      senderRole: UserRole.WORKER,
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content:
        "Hello, I'll be coming to fix your faucet on March 30th at 10 AM. I'll need access to the water shut-off valve. Will someone be home?",
      timestamp: "2024-03-22T14:45:00Z",
      attachments: [],
    },
    {
      id: "msg-4",
      senderId: "tenant-1",
      senderName: "Alice Johnson",
      senderRole: UserRole.TENANT,
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Yes, I'll be home. The shut-off valve is under the sink. Here's another photo of the leak.",
      timestamp: "2024-03-23T08:20:00Z",
      attachments: ["/placeholder.svg?height=200&width=300"],
    },
]

const MaintenanceWorker = () => {
    const { maintenanceId } = useParams<{ maintenanceId: string }>();
    const chatMessages = sampleChatMessages;
    
    const { data: maintenanceRequest, isLoading, error, refetch } = useQuery({
        queryKey: ['maintenanceRequest', maintenanceId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/maintenance/getRequest?maintenanceId=${maintenanceId}`);

            if(response.status === 404) {
                toast.error("Maintenance request not found");
                return null
            }
            
            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data as MaintenanceGetRequest;
        },
        refetchOnWindowFocus: false
    })

    // listen to socket messages

    if(isLoading) return <LoadingSpinner />

    if(error) return <SomethingWentWrong reset={refetch} />

    if(!maintenanceRequest) return <NotFound />

    
    return (
        <div className="container max-w-4xl mx-auto py-4 px-4 md:py-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold">{maintenanceRequest.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Maintenance ID: {maintenanceId}</span>
                        <span>•</span>
                        <span>{maintenanceRequest.condo.name}</span>
                    </div>
                </div>
            </div>

            {/* Maintenance Details Card - Collapsible */}
            <MaintenanceDetails maintenanceRequest={maintenanceRequest} />

            {/* Chat Section */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Communication</CardTitle>
                    <CardDescription>Chat with tenant and landlord</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col h-[400px]">
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                            {chatMessages.map((message) => (
                                <MaintenanceMessage 
                                message={message}
                                key={message.id}
                                />
                            ))}
                        </div>

                        {/* Attachment Previews */}
                        {/* {attachmentPreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {attachmentPreviews.map((preview, index) => (
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
                        )} */}

                        {/* Message Input */}
                        <MaintenanceMessageInput />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default MaintenanceWorker