import PayoutMethodForm, { formSchema } from "@/components/form/PayoutMethodForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axiosFetch from "@/lib/axios"
import { ValidationError } from "@/lib/handleValidationError"
import { useQueryClient } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { z } from "zod"

type UpdatePayoutMethodProps = {
    method: payoutMethod
}

const UpdatePayoutMethod = ({
    method,
}: UpdatePayoutMethodProps) => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onSubmit = async (data: z .infer<typeof formSchema>) => {
        const response = await axiosFetch.patch('/payout-method', data, {
            params: { id: method.id }
        })

        if(response.status === 400) {
            throw new ValidationError(response);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message);
        }

        toast.success('Payout method has been updated!');
        setIsOpen(false);
        await queryClient.setQueryData(['payout', 'methods'], (oldData: payoutMethods) => {
            if (!oldData) return;
            return oldData.map((m) => m.id === method.id ? response.data : m);
        }
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} className="justify-start w-full">
                    <Pencil className="mr-2 h-4 w-4" />
                    Update Method
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                        Update Payout Method
                    </DialogTitle>
                    <DialogDescription>
                        update a payout method in your account.
                    </DialogDescription>
                </DialogHeader>

                <PayoutMethodForm isUpdate initialData={method} onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default UpdatePayoutMethod