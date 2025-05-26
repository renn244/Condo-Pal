import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import axiosFetch from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type DeletePayoutMethodProps = {
    methodId: string;
}

const DeletePayoutMethod = ({
    methodId,
}: DeletePayoutMethodProps) => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { mutate, isPending } = useMutation({
        mutationKey: ['payout', 'method', 'delete'],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/payout-method`, {
                params: { id: methodId }
            });

            if (response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['payout', 'methods'] });
            toast.success('Payout method has been deleted!');

            setIsOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} className="justify-start w-full text-destructive focus:text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Method
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    Delete Payout Method
                </DialogHeader>
                <DialogDescription>
                    are you sure you want to delete this payout method? This action cannot be undone.
                </DialogDescription>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)} variant="outline">
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

export default DeletePayoutMethod