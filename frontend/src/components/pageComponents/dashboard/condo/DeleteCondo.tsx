import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useCondoParams from "@/hooks/useCondoParams";
import axiosFetch from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";

type DeleteCondoProps = {
    condoId: string
}

const DeleteCondo = ({
    condoId
}: DeleteCondoProps) => {
    const queryClient = useQueryClient();
    const { page, search } = useCondoParams();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { mutate, isPending } = useMutation({
        mutationKey: ['condo', 'delete'],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/condo?condoId=${condoId}`)

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['condos', page, search] })
            toast.success('Condo has been deleted!')

            setIsOpen(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="justify-start w-full text-destructive focus:text-destructive hover:text-destructive">
                    {/* should we delete or archived?? */}
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Condo
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete Condo
                    </DialogTitle>
                    <DialogDescription>
                        Note: Once you delete condo you can't get it back and all the information will be lost,
                        includiong the expenses.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)} variant='outline'>
                        Cancel
                    </Button>
                    <Button disabled={isPending} onClick={() => mutate()} variant='destructive'>
                        {isPending ? <LoadingSpinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCondo