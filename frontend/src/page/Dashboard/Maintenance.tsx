import MaintenanceCard from "@/components/pageComponents/dashboard/maintenance/MaintenanceCard"
import MaintenanceHeader from "@/components/pageComponents/dashboard/maintenance/MaintenanceHeader"
import MaintenancePagination from "@/components/pageComponents/dashboard/maintenance/MaintenancePagination"
import NewRequestDialog from "@/components/pageComponents/dashboard/maintenance/NewRequestDialog"
import useMaintenanceParams from "@/hooks/useMaintenanceParams"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

const Maintenance = () => {
    const { search, status, priority, page, setPage, setStatus, setPriority, setSearch } = useMaintenanceParams();

    const { data: getMaintenance } = useQuery({
        queryKey: ['maintenance', page, search, status, priority],
        queryFn: async () => {
            // add search ang page later as well as the filters of status and priority
            const response = await axiosFetch.get(`/maintenance?search=${search || ""}&status=${status}&priority=${priority}&page=${page}`)

            return response.data as MaintenanceRequest
        },
        refetchOnWindowFocus: false,
    })

    return (
        <div className="flex flex-col h-full">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary">
                    Maintenance Requests
                </h1>
                <NewRequestDialog />
            </header>

            <div className="flex flex-col gap-4 mb-6">
                <MaintenanceHeader 
                search={search} status={status} priority={priority}
                setSearch={setSearch} setStatus={setStatus} setPriority={setPriority}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getMaintenance?.maintenanceRequests.map((maintenance) => (
                    <MaintenanceCard maintenance={maintenance} />
                ))}
            </div>

            {(getMaintenance && getMaintenance?.maintenanceRequests.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                    No maintenance requests found matching your criteria
                </div>
            )}

            {/* Pagination */}
            <MaintenancePagination page={page} setPage={setPage} totalPages={getMaintenance?.totalPages || 1} hasNext={getMaintenance?.hasNext || false} />
        </div>
    )
}

export default Maintenance