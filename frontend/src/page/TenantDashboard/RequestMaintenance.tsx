import MaintenanceForm, { formSchema } from "@/components/form/MaintenanceForm"
import axiosFetch from "@/lib/axios"
import { ValidationError } from "@/lib/handleValidationError"
import { toFormData } from "axios"
import toast from "react-hot-toast"
import { z } from "zod"

const RequestMaintenance = () => {

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = toFormData({
            title: data.title,
            description: data.description,
            type: data.type,
            priorityLevel: data.priorityLevel,
            preferredSchedule: data.preferredSchedule
        })
        data.photos.forEach((file) => {
            formData.append('photos', file); // Ensure backend expects 'photos' as an array
        });
        
        const response = await axiosFetch.post('/maintenance/requestMaintenance', formData, {
            headers: {
                'Content-Type': "multipart/form-data"
            }
        });

        if(response.status === 400) { 
            throw new ValidationError(response);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message);
        }

        toast.success('Maintenance Requested!')
        // redirect
        // maybe update query if there is a query for tenant
    }

    return (
        <div className="min-h-[850px] w-full">
            <div className="mx-auto max-w-[900px] p-4 space-y-6">
                <h1 className="text-3xl font-bold text-primary">
                    Maintenance Request
                </h1>
                <MaintenanceForm onsubmit={onSubmit} />
            </div>
        </div>
    )
}

export default RequestMaintenance