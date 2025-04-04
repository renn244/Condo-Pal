import LoadingSpinner from "@/components/common/LoadingSpinner"
import NotFound from "@/components/common/NotFound"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import MaintenanceChat from "@/components/pageComponents/maintenanceWorker/MaintenanceChat"
import MaintenanceDetails from "@/components/pageComponents/maintenanceWorker/MaintenanceDetails"
import { Button } from "@/components/ui/button"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

const MaintenanceWorker = () => {
    const { maintenanceId } = useParams<{ maintenanceId: string }>();
    
    const { data: maintenanceRequest, isLoading, error, refetch } = useQuery({
        queryKey: ['maintenanceRequest', maintenanceId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/maintenance/getRequest?maintenanceId=${maintenanceId}`);

            if(response.status === 404) {
                toast.error("Maintenance request not found");
                return null
            }
            
            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data as MaintenanceGetRequest;
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) return <LoadingSpinner />

    if(error) return <SomethingWentWrong reset={refetch} />

    if(!maintenanceRequest) return <NotFound />


    return (
        <div className="container max-w-4xl mx-auto py-4 px-4 md:py-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold">{maintenanceRequest.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Maintenance ID: {maintenanceId}</span>
                        <span>•</span>
                        <span>{maintenanceRequest.condo.name}</span>
                    </div>
                </div>
            </div>

            {/* Maintenance Details Card - Collapsible */}
            <MaintenanceDetails maintenanceRequest={maintenanceRequest} />

            {/* Chat Section */}
            <MaintenanceChat maintenanceId={maintenanceRequest.id} />
        </div>
    )
}

export default MaintenanceWorker