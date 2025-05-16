import LoadingSpinner from "@/components/common/LoadingSpinner";
import NotFound from "@/components/common/NotFound";
import SomethingWentWrong from "@/components/common/SomethingWentWrong";
import AllMaintenanceForm, { formSchema } from "@/components/form/AllMaintenanceForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import axiosFetch from "@/lib/axios";
import { ValidationError } from "@/lib/handleValidationError";
import { useQuery } from "@tanstack/react-query";
import { toFormData } from "axios";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { z } from "zod";

const EditMaintenance = () => {
    const { maintenanceId } = useParams<{ maintenanceId: string }>();

    const onSubmit = async (data: z.infer<typeof formSchema>, previousPhotos?: string[], previousProofPhotos?: string[]) => {
        const formData = toFormData({
            title: data.title, description: data.description,
            type: data.type, priorityLevel: data.priorityLevel,
            preferredSchedule: data.preferredSchedule, Status: data.Status,
            estimatedCost: data.estimatedCost, totalCost: data.totalCost,
            paymentResponsibility: data.paymentResponsibility,
            scheduledDate: data.scheduledDate, completionDate: data.completionDate,
            previousPhotos: previousPhotos, previousCompletionPhotos: previousProofPhotos,
        });
        data?.photos?.forEach((file) => {
            formData.append('photos', file);
        })
        data?.proofOfCompletion?.forEach((file) => {
            formData.append('completionPhotos', file);
        })

        const response = await axiosFetch.patch(`/maintenance/editMaintenanceRequestLandlord`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }, params: { maintenanceId: maintenanceId }
        });

        if (response.status === 400) {
            throw new ValidationError(response);
        }

        if (response.status >= 401) {
            throw new Error(response.data.message);
        }

        toast.success('Maintenance Request update!');
        history.back();
    }

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['getMaintenance', maintenanceId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/maintenance/getRequest`, { params: { maintenanceId: maintenanceId} })
        
            if(response.status === 404) {
                return null;
            }

            if(response.status >= 400) {
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }

            return response.data as MaintenanceGetRequest;
        },
        refetchOnWindowFocus: false,
        retry: false, gcTime: 0,
    })

    if(isLoading) {
        return <LoadingSpinner />
    }
    
    if(error) {
        return <SomethingWentWrong reset={refetch} />
    }

    if(!data) {
        return <NotFound />
    }

    return (
        <div className="min-h-[850px] w-full">
            <div className="mx-auto max-w-[900px] p-4 space-y-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-primary">
                        Maintenance Request
                    </h1>
                    <div className="flex justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="underline decoration-dotted ml-1 cursor-help">
                                    <AlertCircle className="h-7 w-7 text-red-500" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xsp-5 shadow-lg bg-muted rounded-md border">
                                    <h1 className="font-semibold text-base text-red-500">You are responsible for all changes made here.</h1>
                                    <p className="font-medium text-sm mb-1 text-muted-foreground">Before making changes:</p>
                                    <ul className="text-xs list-disc pl-4 space-y-1 text-muted-foreground">
                                        <li>Communicate with tenant about maintenance plans</li>
                                        <li>Confirm scheduling details before setting dates</li>
                                        <li>Discuss any cost implications, especially if tenant has payment responsibility</li>
                                        <li>Provide reasonable notice for any maintenance visits</li>
                                        <li>Document all communication for your records</li>
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <AllMaintenanceForm initialData={data} onsubmit={onSubmit} />
            </div>
        </div>
    )
}

export default EditMaintenance