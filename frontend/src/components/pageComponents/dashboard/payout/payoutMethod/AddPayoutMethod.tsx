import PayoutMethodForm, { formSchema } from "@/components/form/PayoutMethodForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axiosFetch from "@/lib/axios"
import { ValidationError } from "@/lib/handleValidationError"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import { z } from "zod"

const AddPayoutMethod = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.post('/payout-method', data);

        if(response.status === 400) {
            throw new ValidationError(response);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message);
        }

        toast.success('Payout method has been added!');
        setIsOpen(false);
        await queryClient.setQueryData(['payout', 'methods'], (oldData: payoutMethods) => {
            return oldData ? [...oldData, response.data] : [response.data];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full">
                    Add New Payout Method
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                        Add Payout Method
                    </DialogTitle>
                    <DialogDescription>
                        Add a new payout method to your account.
                    </DialogDescription>
                </DialogHeader>

                <PayoutMethodForm onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default AddPayoutMethod