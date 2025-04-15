import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getPriorityBadgeVariant, getStatusBadgeVariant } from "@/lib/badgeVariant"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { Calculator, Calendar, CalendarCheck, CheckCircle, Clock, Home, PenTool } from "lucide-react"
import MaintenanceOptions from "./MaintenanceOptions"
import useMaintenanceParams from "@/hooks/useMaintenanceParams"
import formatDateTime from "@/lib/formatDateTime"

type MaintenanceCardProps = {
    maintenance: maintenanceCard
}

const MaintenanceCard = ({
    maintenance
}: MaintenanceCardProps) => {
    const { page, search, status, priority } = useMaintenanceParams()

    return (
        <Card key={maintenance.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Badge variant={getStatusBadgeVariant(maintenance.Status)}>{maintenance.Status.replace(/_/g, " ")}</Badge>
                        <Badge variant={getPriorityBadgeVariant(maintenance.priorityLevel)}>{maintenance.priorityLevel}</Badge>
                    </div>
                    <MaintenanceOptions queryKey={['maintenance', page, search, status, priority]} maintenance={maintenance} />
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="mb-4 ,mb-auto">
                    <h3 className="font-semibold mb-1">{maintenance.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 h-[40px] max-w-[497.45px]">
                        {maintenance.description}
                    </p>
                </div>

                <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {maintenance.condo.name}
                        </span>
                    </div>

                    {maintenance.photos.length > 0 && (
                        <div className="flex gap-2">
                            {maintenance.photos.map((photo, index) => (
                                <img 
                                key={index}
                                src={photo}
                                className="h-16 w-16 rounded-md object-cover"
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <PenTool className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{maintenance.type.replace(/_/g, " ")}</span>
                    </div>

                    {maintenance.estimatedCost && (
                        <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Estimated: {" "}
                                {formatToPesos(maintenance.estimatedCost)}
                                {maintenance.paymentResponsibility && (
                                    <span className="ml-1">({maintenance.paymentResponsibility.toLowerCase()})</span>
                                )}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {maintenance.Status === 'PENDING' && (
                            <>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Preferred Scheduled: {
                                    maintenance.preferredSchedule ? formatDate(new Date(maintenance.preferredSchedule)) : 'anytime'
                                }</span>
                            </>
                        )}
                        {maintenance.Status === 'SCHEDULED' && (
                            <>
                                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Scheduled: {
                                    maintenance.scheduledDate ? formatDateTime(new Date(maintenance.scheduledDate)) : 'anytime'
                                }</span>
                            </>
                        )}
                        {maintenance.Status === 'COMPLETED' && (
                            <>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Completed: {
                                    maintenance.completionDate ? formatDateTime(new Date(maintenance.completionDate)) : 'anytime'
                                }</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Submitted: {formatDate(new Date(maintenance.createdAt))}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MaintenanceCard