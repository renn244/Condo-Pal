import CondoForm, { formSchema } from "@/components/form/CondoForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useCondoParams from "@/hooks/useCondoParams"
import axiosFetch from "@/lib/axios"
import { ValidationError } from "@/lib/handleValidationError"
import { CondoResponse } from "@/page/Dashboard/Condo"
import { useQueryClient } from "@tanstack/react-query"
import { toFormData } from "axios"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { z } from "zod"

const CreateCondo = () => {
    const queryClient = useQueryClient();
    const { page, search } = useCondoParams();
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = toFormData({
            photo: data.photo?.[0],
            name: data.name,
            address: data.address,
            rentAmount: data.rentAmount,
            isActive: data.isActive
        });

        const response = await axiosFetch.post('/condo', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if(response.status === 400) {
            throw new ValidationError(response);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message);
        }

        toast.success('Condo has been added!')
        setIsOpen(false)
        await queryClient.setQueryData(['condos', page, search], (oldData: CondoResponse) => {
            return {
                ...oldData,
                getCondos: [...oldData.getCondos, response.data]
            }
        })

        return
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Condo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px]">
                <DialogHeader>
                    <DialogTitle>
                        Add Condo
                    </DialogTitle>
                    <DialogDescription>
                        {/* think of better description */}
                        Adding Condo means that you are adding it for management  
                    </DialogDescription>
                </DialogHeader>
                <CondoForm onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default CreateCondo