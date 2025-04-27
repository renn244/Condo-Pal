import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosFetch from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type DeleteExpenseProps = {
    expenseId: string,
    condoId: string
}

const DeleteExpense = ({
    expenseId,
    condoId
}: DeleteExpenseProps) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationKey: ['expense', 'delete'],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/expense?condoId=${condoId}&expenseId=${expenseId}`)

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['expenses'] })
            toast.success('Expense has been deleted!')

            setOpen(false)
        },
        onError: (error: any) => {
            toast.error(error.message)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="justify-start w-full text-destructive focus:text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> 
                    Delete Expense
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete Condo
                    </DialogTitle>
                    <DialogDescription>
                        Note: Once you delete condo you can't get it back and all the information will be lost.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant="outline">
                        Cancel
                    </Button>
                    <Button disabled={isPending} onClick={() => mutate()} variant="destructive">
                        {isPending ? <LoadingSpinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteExpense