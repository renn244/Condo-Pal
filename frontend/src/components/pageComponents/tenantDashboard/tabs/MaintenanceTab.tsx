import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { useAuthContext } from "@/context/AuthContext"
import useTenantDashboardParams from "@/hooks/useTenantDashboardParams"
import axiosFetch from "@/lib/axios"
import { getPriorityBadgeVariant, getStatusBadgeVariant } from "@/lib/badgeVariant"
import formatDate from "@/lib/formatDate"
import { useQuery } from "@tanstack/react-query"
import { MoreVertical, Plus, SquareArrowOutUpRight, Wrench } from "lucide-react"
import MaintenanceHeader from "../../dashboard/maintenance/MaintenanceHeader"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import MaintenancePagination from "../../dashboard/maintenance/MaintenancePagination"
import { Link } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import ViewDetails from "../../dashboard/maintenance/ViewDetails"
import { Separator } from "@/components/ui/separator"
import CancelMaintenance from "../../dashboard/maintenance/CancelMaintenance"

const MaintenanceTab = () => {
    const { user } = useAuthContext();
    const { 
        maintenancePage: page, maintenanceSearch: search, status, priority,
        setPage, setSearch, setStatus, setPriority
    } = useTenantDashboardParams();
    const condoId = user!.condo.id;

    // should be infinite scroll
    const { data: maintenance, isLoading } = useQuery({
        queryKey: ["maintenanceRequests", page, search, status, priority, condoId],
        enabled: !!condoId,
        queryFn: async () => {
            const response = await axiosFetch.get(
                `/maintenance?page=${page}&search=${search}&status=${status}&priority=${priority}&condoId=${condoId}`
            )

            return response.data as MaintenanceRequest
        },
        refetchOnWindowFocus: false,
    })

    return (
        <TabsContent value="maintenance" className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>Maintenance Requests</CardTitle>
                    <CardDescription>View and manage your maintenance requests</CardDescription>
                </div>
                <Button asChild>
                    <Link to="/tenant/maintenanceRequest">
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Link>
                </Button>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <MaintenanceHeader 
                        search={search} status={status} priority={priority}
                        setSearch={(value) => setSearch('maintenance', value)} setStatus={setStatus} setPriority={setPriority}
                        />
                    </div>
        
                    {isLoading ? (
                        <div className="h-[276px] flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        maintenance && maintenance.maintenanceRequests.length > 0 ? (
                            <div className="space-y-4">
                                {maintenance.maintenanceRequests.map((request) => (
                                    <div key={request.id} className="p-4 border rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{request.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getPriorityBadgeVariant(request.priorityLevel)}>
                                                    {request.priorityLevel}
                                                </Badge>
                                                <Badge variant={getStatusBadgeVariant(request.Status)}>
                                                    {request.Status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 text-sm">
                                            <div className="flex gap-4">
                                                <span className="text-muted-foreground">Created: {formatDate(new Date(request.createdAt))}</span>
                                                <span className="text-muted-foreground">Priority: {request.priorityLevel}</span>
                                            </div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="end" className="w-56 p-1">
                                                    <ViewDetails maintenance={request} />
                                                    {(request.Status !== "PENDING" && request.Status !== "CANCELED") && (
                                                        <Link to={`/maintenance/worker/${request.id}`}>
                                                            <Button variant="ghost" className="w-full justify-start">
                                                                <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                                                                View Chat With Worker
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {request.Status === "PENDING" && (
                                                        <>
                                                            <Separator className="my-1" />
                                                            <CancelMaintenance 
                                                            queryKey={["maintenanceRequests", page, search, status, priority, condoId]} 
                                                            maintenanceId={request.id} 
                                                            />
                                                        </>
                                                    )}
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Wrench className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                                <h3 className="font-medium text-lg mb-2">No Maintenance Requests</h3>
                                <p className="text-muted-foreground mb-4">You don't have any maintenance requests at the moment.</p>
                                <Button asChild>
                                    <Link to="/maintenanceRequest">
                                        Submit a Request
                                    </Link>
                                </Button>
                            </div>
                        )
                    )}
                </CardContent>
                <CardFooter className="justify-center">
                    {maintenance?.totalPages && 
                        <MaintenancePagination
                        page={page} setPage={(value) => setPage('maintenance', value)}
                        totalPages={maintenance.totalPages} hasNext={maintenance.hasNext} />
                    }
                </CardFooter>
            </Card>
        </TabsContent>
    )
}

export default MaintenanceTab