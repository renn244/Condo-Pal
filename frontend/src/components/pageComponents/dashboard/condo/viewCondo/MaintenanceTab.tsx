import { TabsContent } from "@/components/ui/tabs"
import useViewCondoParams from "@/hooks/useViewCondoParams"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import MaintenanceStatusChart from "../../maintenance/tab/MaintenanceStatusChart"
import MaintenanceCostDistributionChart from "../../maintenance/tab/MaintenanceCostDistributionChart"
import MaintenanceTable from "../../maintenance/tab/MaintenanceTable"

type MainteananceTabProps = {
    condo: any
}

const MaintenanceTab = ({
    condo
}: MainteananceTabProps) => {
    const { maintenancePage, status, priority, maintenanceSearch } = useViewCondoParams();

    const { data: maintenance, isLoading } = useQuery({
        queryKey: ['maintenance', 'table', maintenancePage, status, priority, maintenanceSearch, condo.id],
        queryFn: async () => {  
            const response = await axiosFetch.get(
                `/maintenance?page=${maintenancePage}&search=${maintenanceSearch}&status=${status}&priority=${priority}&condoId=${condo.id}&take=10`
            )

            return response.data as MaintenanceRequest
        },
        refetchOnWindowFocus: false,
    })
    
    const { data: maintenanceStats } = useQuery({
        queryKey: ['maintenance', 'stats', condo.id],
        queryFn: async () => {
            const response = await axiosFetch.get(`/maintenance/stats/${condo.id}`);

            return response.data as MaintenanceRequestStats;
        },
        refetchOnWindowFocus: false,
    })
    
    return (
        <TabsContent value="maintenance" className="space-y-6">

            {/* Maintenance Table */}
            <MaintenanceTable maintenance={maintenance} isLoading={isLoading} condoId={condo.id} />

            {/* Maintenance Status Chart */}
            <MaintenanceStatusChart key={`status-chart-${condo.id}`} maintenanceStats={maintenanceStats} />

            {/* Maintenance Cost Distribution Chart */}
            <MaintenanceCostDistributionChart key={`cost-chart-${condo.id}`} costDistributionStats={maintenanceStats?.costDistributionStats} />
        </TabsContent>
    )
}

export default MaintenanceTab