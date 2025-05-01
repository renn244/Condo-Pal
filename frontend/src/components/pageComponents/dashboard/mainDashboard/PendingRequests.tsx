import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { getPriorityBadgeVariant, getStatusBadgeVariant } from "@/lib/badgeVariant"
import formatDate from "@/lib/formatDate"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, Wallet } from "lucide-react"

const PendingRequests = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["maintenance", "priority"],
        queryFn: async () => {
            const response = await axiosFetch.get("/maintenance/getPriorityMaintenance");

            return response.data as getPriorityMaintenanceReqeuest;
        }
    })
    
    if(isLoading) return <LoadingSpinner />

    if(!data) return null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Maintenance Requests</CardTitle>
                    <CardDescription>{data.pendingMaintenanceCount} pending requests</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.maintenanceRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-muted rounded-md p-2">
                                    <Wallet className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{request.title}</p>
                                    <p className="text-xs text-muted-foreground">{request.condo.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">{formatDate(new Date(request.createdAt))}</p>
                                    <Badge variant={getStatusBadgeVariant(request.Status)}>
                                        {request.Status}
                                    </Badge>
                                </div>
                                <Badge variant={getPriorityBadgeVariant(request.priorityLevel)}>
                                    {request.priorityLevel}    
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                    Create New Request
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PendingRequests