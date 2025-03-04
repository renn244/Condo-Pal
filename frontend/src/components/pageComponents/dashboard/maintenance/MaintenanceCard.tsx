import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { Clock, DollarSign, Calendar, Home, MoreVertical, Pencil, PenTool } from "lucide-react"
import ViewDetails from "./ViewDetails"
import { getPriorityBadgeVariant, getStatusBadgeVariant } from "@/lib/badgeVariant"
import CancelMaintenance from "./CancelMaintenance"

type MaintenanceCardProps = {
    maintenance: maintenanceCard
}

const MaintenanceCard = ({
    maintenance
}: MaintenanceCardProps) => {

    return (
        <Card key={maintenance.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Badge variant={getStatusBadgeVariant(maintenance.Status)}>{maintenance.Status.replace(/_/g, " ")}</Badge>
                        <Badge variant={getPriorityBadgeVariant(maintenance.priorityLevel)}>{maintenance.priorityLevel}</Badge>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-1">
                            <ViewDetails maintenance={maintenance} />
                            <Button variant="ghost" className="w-full justify-start">
                                <Clock className="mr-2 h-4 w-4" />
                                Update Status
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit maintenance
                            </Button>
                            {maintenance.Status !== "CANCELED" && (
                                <>
                                    <Separator className="my-1" />
                                    <CancelMaintenance maintenanceId={maintenance.id} />
                                </>
                            )}
                        </PopoverContent>
                    </Popover>
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
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                            Estimated: 
                            {formatToPesos(maintenance.estimatedCost)}
                            {maintenance.paymentResponsibility && (
                                <span className="ml-1">({maintenance.paymentResponsibility.toLowerCase()})</span>
                            )}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Preferred Scheduled: {
                            maintenance.preferredSchedule ? formatDate(new Date(maintenance.preferredSchedule)) : 'anytime'
                        }</span>
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