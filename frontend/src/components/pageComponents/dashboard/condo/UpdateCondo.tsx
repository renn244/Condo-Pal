import CondoForm, { formSchema } from '@/components/form/CondoForm'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import useCondoParams from '@/hooks/useCondoParams'
import axiosFetch from '@/lib/axios'
import { ValidationError } from '@/lib/handleValidationError'
import { CondoResponse } from '@/page/Dashboard/Condo'
import { useQueryClient } from '@tanstack/react-query'
import { toFormData } from 'axios'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'

type UpdateCondoProps = {
    initialCondo: condo,
    condoId: string,
}

const UpdateCondo = ({
    initialCondo,
    condoId
}: UpdateCondoProps) => {
    const queryClient = useQueryClient();
    const { page, search } = useCondoParams()
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = toFormData({
            photo: data.photo?.[0],
            name: data.name,
            address: data.address,
            rentAmount: data.rentAmount,
            isActive: data.isActive
        })
        
        const response = await axiosFetch.patch(`/condo?condoId=${condoId}`, formData)

        if(response.status === 400) {
            throw new ValidationError(response);
        }

        if(response.status >= 401) {
            throw new Error(response.data.message)
        }

        toast.success('Condo Info has been updated!')
        setIsOpen(false)
        await queryClient.setQueryData(['condos', page, search], (oldData: CondoResponse) => {
            return {
                ...oldData,
                getCondos: oldData.getCondos.map((condo) => {
                    if(condo.id === condoId) {
                        return response.data
                    }

                    return condo
                })
            }
        })

        return
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                <Button variant={'ghost'} className='w-full justify-start'>
                    <Pencil className='mr-2 h-4 w-4' /> Update Condo
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[850px]'>
                <DialogHeader>
                    <DialogTitle>
                        Update Condo
                    </DialogTitle>                        
                </DialogHeader>
                <CondoForm initialData={initialCondo} isUpdate onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default UpdateCondo