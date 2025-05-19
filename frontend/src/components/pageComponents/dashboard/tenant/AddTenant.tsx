import TenantForm, { formSchema } from "@/components/form/TenantForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useCondoParams from "@/hooks/useCondoParams";
import axiosFetch from "@/lib/axios";
import { ValidationError } from "@/lib/handleValidationError";
import { CondoResponse } from "@/page/Dashboard/Condo";
import { useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";
import { z } from "zod";

type AddTenantProps = {
    condoId: string
}

const AddTenant = ({
    condoId
}: AddTenantProps) => {
    const queryClient = useQueryClient();
    const { page, search } = useCondoParams();
    const [open, setOpen] = useState<boolean>(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.post('/auth/register-tenant', {
            ...data,
            condoId
        })

        if(response.status === 400) {
            throw new ValidationError(response);
        }

        if(response.status >= 400) {
            throw new Error(response.data.message);
        }

        toast.success('Tenant has been added!')
        setOpen(false);
        await queryClient.setQueryData(['condos', page, search], (oldData: CondoResponse) => {
            const tenantData = response.data;

            return {
                ...oldData,
                getCondos: oldData.getCondos.map((condo) => {
                    if(condo.id === condoId) {
                        return {
                            ...condo,
                            agreements: [
                                { id: tenantData.leaseAgreementId }
                            ],
                            isActive: true,
                            tenant: {
                               id: tenantData.id,
                               name: tenantData.name,
                               profile: tenantData.profile || '',
                            }
                        }
                    }

                    return condo
                })
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Tenant
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        Add Tenant
                    </DialogTitle>
                </DialogHeader>
                <TenantForm onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default AddTenant