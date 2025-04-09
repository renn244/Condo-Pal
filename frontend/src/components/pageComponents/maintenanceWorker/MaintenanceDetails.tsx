import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MaintenanceStatus } from "@/constant/maintenance.constants"
import { getPriorityBadgeVariant, getStatusBadgeVariant } from "@/lib/badgeVariant"
import formatDate from "@/lib/formatDate"
import { Calculator, Calendar, CalendarCheck, CheckCircle, ChevronDown, ChevronUp, Home, PenTool, ReceiptText, User } from "lucide-react"
import { useState } from "react"
import MaintenanceUpdateInProgress from "./MaintenanceUpdateInProgress"
import MaintenanceUpdateCompleted from "./MaintenanceUpdateCompleted"
import formatDateTime from "@/lib/formatDateTime"
import formatToPesos from "@/lib/formatToPesos"
import { useAuthContext } from "@/context/AuthContext"

type MaintenanceDetailsProps = {
    maintenanceRequest: MaintenanceGetRequest
}

const MaintenanceDetails = ({
    maintenanceRequest,
}: MaintenanceDetailsProps) => {
    const { user } = useAuthContext();
    const [detailsVisible, setDetailsVisible] = useState(false);
    
    return (
        <Card className="mb-6">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CardTitle>Maintenance Details</CardTitle>
                        <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setDetailsVisible(!detailsVisible)}
                        >
                            {detailsVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        </div>
                        <div className="flex gap-2">
                        <Badge variant={getStatusBadgeVariant(maintenanceRequest.Status)}>
                            {maintenanceRequest.Status}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(maintenanceRequest.priorityLevel)}>
                            {maintenanceRequest.priorityLevel}
                        </Badge>
                    </div>
                </div>
                <CardDescription>{maintenanceRequest.condo.address}</CardDescription>
            </CardHeader>

            {detailsVisible && (
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                            <p className="text-sm">{maintenanceRequest.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <PenTool className="h-4 w-4 text-muted-foreground" />
                                        <span>Type: {maintenanceRequest.type.replace("_", " ")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>Created: {formatDate(new Date(maintenanceRequest.createdAt))}</span>
                                    </div>
                                    {maintenanceRequest.scheduledDate && (
                                        <div className="flex items-center gap-2">
                                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                                            <span>Scheduled: {formatDateTime(new Date(maintenanceRequest.scheduledDate))}</span>
                                        </div>
                                    )}
                                    {maintenanceRequest.completionDate && (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                            <span>Completed: {formatDateTime(new Date(maintenanceRequest.completionDate))}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">People</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>Tenant: {maintenanceRequest.condo.tenant.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4 text-muted-foreground" />
                                        <span>Landlord: {maintenanceRequest.condo.owner.name}</span>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-muted-foreground my-1">Cost Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calculator className="h-4 w-4 text-muted-foreground" />
                                        <span>Estimated Cost: {maintenanceRequest.estimatedCost ? formatToPesos(maintenanceRequest.estimatedCost) : "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ReceiptText className="h-4 w-4 text-muted-foreground" />
                                        <span>Total Cost: {maintenanceRequest.totalCost ? formatToPesos(maintenanceRequest.totalCost) : "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {maintenanceRequest.photos.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Photos</h3>
                                <div className="flex flex-wrap gap-2">
                                    {maintenanceRequest.photos.map((photo: any, index: number) => (
                                        <img
                                        key={index}
                                        src={photo || "/placeholder.svg"}
                                        alt={`Maintenance photo ${index + 1}`}
                                        className="h-20 w-20 object-cover rounded-md border"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </CardContent>
            )}

            {/* If the Status is just scheduled */}
            {(!detailsVisible && maintenanceRequest.Status === MaintenanceStatus.SCHEDULED && !user) && (
                <MaintenanceUpdateInProgress maintenanceRequest={maintenanceRequest} />
            )}

            {/* If the Status is In-Progress */}
            {(!detailsVisible && maintenanceRequest.Status === MaintenanceStatus.IN_PROGRESS && !user) && (
                <MaintenanceUpdateCompleted maintenanceRequest={maintenanceRequest} />
            )}
        </Card>
    )
}

export default MaintenanceDetails