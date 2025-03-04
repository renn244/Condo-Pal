import { MaintenanceStatus, PriorityLevel } from "@/constant/maintenance.constants"


export const getPriorityBadgeVariant = (priority: PriorityLevel) => {
    switch(priority) {
        case PriorityLevel.LOW:
            return "secondary"
        case PriorityLevel.MEDIUM:
            return "default"
        case PriorityLevel.HIGH:
            return "destructive"
    }
}    

export const getStatusBadgeVariant = (status: MaintenanceStatus) => {
    switch(status) {
        case MaintenanceStatus.PENDING:
            return "secondary";
        case MaintenanceStatus.IN_PROGRESS:
            return "default";
        case MaintenanceStatus.COMPLETED:
            return "success";
        case MaintenanceStatus.CANCELED:
            return "destructive";
    }
}