import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getPriorityBadgeVariant, getStatusBadgeVariant } from "@/lib/badgeVariant"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { Ban, Calendar, CheckCircle, Clock, DollarSign, Eye, PenTool, User } from "lucide-react"

type ViewDetailsProps = {
    maintenance: maintenanceCard
}

const ViewDetails = ({
    maintenance
}: ViewDetailsProps) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{maintenance.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {maintenance.condo.name} - {maintenance.condo.address}
                    </DialogDescription>
                </DialogHeader>

                {/* Photo Carousel */}
                <div className="relative mt-2 mb-6">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {maintenance.photos.map((photo, index) => (
                                <CarouselItem key={index}>
                                    <div className="flex justify-center items-center p-1 h-full w-full">
                                        <img src={photo} alt={`Maintenance photo ${index + 1}`} className="rounded-lg object-contain max-h-[250px]" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </Carousel>
                </div>

                <div className="grid gap-4 py-2">
                    <div className="space-y-2">
                        <h3 className="font-medium">Description</h3>
                        <p className="text-sm text-muted-foreground max-w-[650px]">{maintenance.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div> 
                            <h3 className="font-medium mb-2">Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Badge variant={getStatusBadgeVariant(maintenance.Status)}>
                                        {maintenance.Status.replace(/_/g, " ")}
                                    </Badge>
                                    <Badge variant={getPriorityBadgeVariant(maintenance.priorityLevel)}>
                                        {maintenance.priorityLevel}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PenTool className="h-4 w-4 text-muted-foreground" />
                                    <span>Type: {maintenance.type.replace(/_/g, " ")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>Submitted: {formatDate(new Date(maintenance.createdAt))}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Preferred Sheduled: {
                                        maintenance.preferredSchedule ? formatDate(new Date(maintenance.preferredSchedule)) : "anytime"
                                    }</span>
                                </div>
                                {maintenance.completionDate && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                        <span>Completed: {formatDate(new Date(maintenance.completionDate))}</span>
                                    </div>
                                )}
                                {maintenance.canceledBy && (
                                    <div className="flex items-center gap-2 text-red-600">
                                        <Ban className="h-4 w-4" />
                                        <span className="capitalize">Canceled By: {" "}
                                            <span className="text-foreground">{maintenance.canceledBy}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Cost Information</h3>
                            <div className="space-y-2 text-sm">
                                {maintenance.estimatedCost && (
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span>Estimated Cost: {formatToPesos(maintenance.estimatedCost)}</span>
                                    </div>
                                )}
                                {maintenance.totalCost && (
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span>Total Cost: {formatToPesos(maintenance.totalCost)}</span>
                                    </div>
                                )}
                                {maintenance.paymentResponsibility && (
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>Payment Responsibility: {maintenance.paymentResponsibility}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewDetails