import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import formatDate from "@/lib/formatDate"
import { Plus, Wrench } from "lucide-react"

const maintenanceRequests = [
    {
      id: "maint-1",
      title: "Leaking Kitchen Faucet",
      description: "The kitchen faucet has been continuously dripping for the past few days.",
      status: "SCHEDULED",
      priority: "MEDIUM",
      createdAt: "2024-03-20T09:00:00Z",
      updatedAt: "2024-03-24T14:30:00Z",
    },
    {
      id: "maint-2",
      title: "Bathroom Light Fixture",
      description: "The light fixture in the guest bathroom is flickering and needs replacement.",
      status: "COMPLETED",
      priority: "LOW",
      createdAt: "2024-03-10T11:30:00Z",
      updatedAt: "2024-03-15T16:45:00Z",
    },
]

const MaintenanceTab = () => {
    return (
        <TabsContent value="maintenance" className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Maintenance Requests</CardTitle>
                    <CardDescription>View and manage your maintenance requests</CardDescription>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                </Button>
                </CardHeader>
                <CardContent>
                    {maintenanceRequests.length > 0 ? (
                        <div className="space-y-4">
                        {maintenanceRequests.map((request) => (
                            <div key={request.id} className="p-4 border rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{request.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                                    </div>
                                    <Badge
                                    variant="outline"
                                    className={`
                                        ${request.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-300" : ""}
                                        ${request.status === "SCHEDULED" ? "bg-blue-50 text-blue-700 border-blue-300" : ""}
                                        ${request.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-300" : ""}
                                    `}
                                    >
                                    {request.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center mt-4 text-sm">
                                    <div className="flex gap-4">
                                        <span className="text-muted-foreground">Created: {formatDate(new Date(request.createdAt))}</span>
                                        <span className="text-muted-foreground">Priority: {request.priority}</span>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Wrench className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                            <h3 className="font-medium text-lg mb-2">No Maintenance Requests</h3>
                            <p className="text-muted-foreground mb-4">You don't have any maintenance requests at the moment.</p>
                            <Button>Submit a Request</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    )
}

export default MaintenanceTab