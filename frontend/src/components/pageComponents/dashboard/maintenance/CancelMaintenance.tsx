import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useMaintenanceParams from "@/hooks/useMaintenanceParams"
import axiosFetch from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { XCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { useAuthContext } from "@/context/AuthContext"
import { MaintenanceRequest } from "@/page/Dashboard/Maintenance"

type CancelMaintenanceProps = {
    maintenanceId: string
}

const CancelMaintenance = ({
    maintenanceId
}: CancelMaintenanceProps) => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();
    const { search, status, priority, page } = useMaintenanceParams();
    const [open, setOpen] = useState<boolean>(false);

    const { mutate, isPending } = useMutation({
        mutationKey: ['maintenance', 'cancel'],
        mutationFn: async () => {
            const response = await axiosFetch.patch(`/maintenance/cancel?maintenanceId=${maintenanceId}`)

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }
            
            return response.data 
        },
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: async () => {
            toast.success("maintenance canceled")
            await queryClient.setQueryData(['maintenance', page, search, status, priority], (oldData: MaintenanceRequest) => ({
                ...oldData,
                maintenanceRequests: oldData.maintenanceRequests.map(maintenance => {
                    if(maintenance.id === maintenanceId) {
                        return {
                            ...maintenance,
                            Status: 'CANCELED',
                            canceledBy: user?.role
                        }
                    }
                    return maintenance
                })
            }))
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-destructive focus:text-destructive hover:text-destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel maintenance
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Are you sure you want to cancel this maintenance request as an owner.
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently cancel the maintenance and this will be on your responsibility.
                        it will also be saved from your history just in case.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant={'outline'} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button disabled={isPending} onClick={() => mutate()} variant="destructive">
                        {isPending ? <LoadingSpinner /> : "Continue"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CancelMaintenance