import MaintenanceCard from "@/components/pageComponents/dashboard/maintenance/MaintenanceCard"
import MaintenanceHeader from "@/components/pageComponents/dashboard/maintenance/MaintenanceHeader"
import { Button } from "@/components/ui/button"
import useMaintenanceParams from "@/hooks/useMaintenanceParams"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"

const Maintenance = () => {
    const { search, status, priority } = useMaintenanceParams();

    const { data: getMaintenance } = useQuery({
        queryKey: ['maintenance', search, status, priority],
        queryFn: async () => {
            // add search ang page later as well as the filters of status and priority
            const response = await axiosFetch.get(`/maintenance?search=${search || ""}&status=${status}&priority=${priority}`)

            return response.data as maintenanceCard[]
        }
    })

    return (
        <div className="flex flex-col h-full">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary">
                    Maintenance Requests
                </h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                </Button>
            </header>

            <div className="flex flex-col gap-4 mb-6">
                <MaintenanceHeader />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getMaintenance?.map((maintenance) => (
                    <MaintenanceCard maintenance={maintenance} />
                ))}
            </div>

            {(getMaintenance && getMaintenance.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                    No maintenance requests found matching your criteria
                </div>
            )}

            {/* Pagination */}
            
        </div>
    )
}

export default Maintenance