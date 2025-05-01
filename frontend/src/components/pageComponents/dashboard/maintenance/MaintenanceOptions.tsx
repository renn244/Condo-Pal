import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MoreVertical, Pencil } from 'lucide-react'
import ViewDetails from './ViewDetails'
import { Separator } from '@/components/ui/separator'
import CancelMaintenance from './CancelMaintenance'
import ScheduleMaintenance from './ScheduleMaintenance'
import { Link } from 'react-router-dom'

type MaintenanceOptionProps = {
    maintenance: maintenanceCard,
    Icon?: React.ReactNode,
    queryKey: any[]
}

const MaintenanceOptions = ({
    maintenance,
    Icon=<MoreVertical className="h-4 w-4" />,
    queryKey
}: MaintenanceOptionProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    {Icon}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-1">
                <ViewDetails maintenance={maintenance} />
                <ScheduleMaintenance 
                maintenancePrefferredSchedule={maintenance.preferredSchedule}
                maintenanceId={maintenance.id} 
                maintenanceTitle={maintenance.title}
                queryKey={queryKey}
                />
                <Link to={`/editMaintenanceRequest/${maintenance.id}`}>
                    <Button variant="ghost" className="w-full justify-start">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit maintenance
                    </Button>
                </Link>
                {maintenance.Status === "PENDING" && (
                    <>
                        <Separator className="my-1" />
                        <CancelMaintenance queryKey={queryKey} maintenanceId={maintenance.id} />
                    </>
                )}
            </PopoverContent>
        </Popover>
    )
}

export default MaintenanceOptions