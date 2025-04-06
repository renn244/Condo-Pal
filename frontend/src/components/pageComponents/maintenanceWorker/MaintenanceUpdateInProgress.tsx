import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { MaintenanceStatus } from "@/constant/maintenance.constants";
import axiosFetch from "@/lib/axios";
import formatDate from "@/lib/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

type MaintenanceUpdateInProgressProps = {
    maintenanceRequest: MaintenanceGetRequest
}

const MaintenanceUpdateInProgress = ({
    maintenanceRequest
}: MaintenanceUpdateInProgressProps) => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const { mutate: updateInProgress, isPending: isPendingInProgress } = useMutation({
        mutationKey: ['maintenanceRequest', 'inProgress', maintenanceRequest.id],
        mutationFn: async () => {
            const response = await axiosFetch.patch(`/maintenance/in-progress?maintenanceId=${maintenanceRequest.id}`, {
                token: token
            })
            
            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async (data) => {
            // update the query here
            await queryClient.setQueryData(['maintenanceRequest', maintenanceRequest.id], (oldData: MaintenanceGetRequest) => {
                return {
                    ...oldData,
                    Status: data.Status,
                }
            })
        }
    });

    return (
        <CardContent>
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    {maintenanceRequest.type.replace("_", " ")} •
                    {maintenanceRequest.scheduledDate && ` Scheduled: ${formatDate(new Date(maintenanceRequest.scheduledDate))} •`}
                    {" "} Created: {formatDate(new Date(maintenanceRequest.createdAt))}
                </div>
                <Button
                onClick={() => updateInProgress()}
                disabled={maintenanceRequest.Status === MaintenanceStatus.CANCELED || isPendingInProgress}
                size="sm"
                >
                    {isPendingInProgress ? <LoadingSpinner /> :  "Start Work"}
                </Button>
            </div>
        </CardContent>
    )
}

export default MaintenanceUpdateInProgress