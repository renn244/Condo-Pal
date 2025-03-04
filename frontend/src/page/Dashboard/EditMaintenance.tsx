import LoadingSpinner from "@/components/common/LoadingSpinner"
import NotFound from "@/components/common/NotFound"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import MaintenanceForm, { formSchema } from "@/components/form/MaintenanceForm"
import axiosFetch from "@/lib/axios"
import { ValidationError } from "@/lib/handleValidationError"
import { useQuery } from "@tanstack/react-query"
import { toFormData } from "axios"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import { z } from "zod"

// for the tenant
const EditMaintenance = () => {
    const { maintenanceId } = useParams<{ maintenanceId: string }>()
    
    const onSubmit = async (data: z.infer<typeof formSchema>, previousPhotos?: string[]) => {
        const formData = toFormData({
            title: data.title,
            description: data.description,
            type: data.type,
            priorityLevel: data.priorityLevel,
            preferredSchedule: data.preferredSchedule,
            previousPhotos: previousPhotos
        })
        data?.photos?.forEach((file) => {
            formData.append('photos', file)
        })

        const response = await axiosFetch.patch(`/maintenance/editMaintenanceRequest?maintenanceId=${maintenanceId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        if(response.status === 400) {
            throw new ValidationError(response);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message);
        }

        toast.success('Maintenance Request updated!')
    }

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['getMaintenance', maintenanceId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/maintenance/getRequest?maintenanceId=${maintenanceId}`)
        
            if(response.status === 404) {
                return undefined
            }

            if(response.status >= 400) {
                toast.error(response.data.message);
                throw new Error(response.data.message)
            }

            return response.data
        },
        refetchOnWindowFocus: false,
        retry: false
    })

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(error) {
        return <SomethingWentWrong reset={refetch}  />
    }
    
    if(!data) {
        return <NotFound />
    }

    return (
        <div className="min-h-[850px] w-full">
            <div className="mx-auto max-w-[900px] p-4 space-y-6">
                <h1 className="text-3xl font-bold text-primary">
                    Maintenance Request
                </h1>
                <MaintenanceForm isUpdate initialData={data} onsubmit={onSubmit} />
            </div>
        </div>
    )
}

export default EditMaintenance