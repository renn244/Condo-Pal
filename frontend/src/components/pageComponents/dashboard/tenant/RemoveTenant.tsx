import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useCondoParams from "@/hooks/useCondoParams";
import axiosFetch from "@/lib/axios";
import { CondoResponse } from "@/page/Dashboard/Condo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CircleDashed, DollarSign, FileWarning, Mail, UserMinus } from "lucide-react";
import { useState } from "react"
import toast from "react-hot-toast";

type RemoveTenantProps = {
    tenantName: string,
    propertyName: string,

    leaseAgreementId: string,
}

const RemoveTenant = ({
    tenantName,
    propertyName,
    leaseAgreementId,
}: RemoveTenantProps) => {
    const { page, search } = useCondoParams();
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [confirmChecks, setConfirmChecks] = useState({
        noticeSent: false,
        unpaidChecked: false,
        depositHandled: false,
        keysReturned: false,
    });

    const handleCheckChange = (key: keyof typeof confirmChecks) => {
        setConfirmChecks((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    const { mutate, isPending } = useMutation({
        mutationKey: ["remove", "tenant"],
        mutationFn: async () => {
            const response = await axiosFetch.delete("/auth/remove-tenant", {
                params: { leaseAgreementId: leaseAgreementId },
            })

            if(response.status >= 400) {
                throw new Error("Error removing tenant!");
            }

            return response.data;
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async (data) => {
            toast.success("Tenant removed successfully!");
            setOpen(false);

            await queryClient.setQueryData(["condos", page, search], (oldData: CondoResponse) => {
                if(!oldData) return;

                return {
                    ...oldData,
                    getCondos: oldData.getCondos.map((condo) => {
                        if(condo.id === data.id) {
                            return {
                                ...condo, isActive: false, tenantId: null, tenant: null,
                                agreements: []
                            }
                        }

                        return condo;
                    }),
                }
            })
        }
    })

    const allChecked = Object.values(confirmChecks).every((check) => check);
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    <UserMinus className="mr-2 h-4 w-4" />
                    Remove Tenant
                </Button>
            </DialogTrigger>
            <DialogContent>
                {currentStep === 1 && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                Remove Tenant
                            </DialogTitle>
                            <DialogDescription>
                                You are about to remove <span className="font-medium">{tenantName}</span> from{" "}
                                <span className="font-medium">{propertyName}</span>. Please review the following warnings.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <Alert variant="destructive" className="border-destructive/80">
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertTitle>Important Notice</AlertTitle>
                                <AlertDescription>
                                    Removing a tenant without proper notice may have legal implications. Make sure you have followed all
                                    local tenant laws before proceeding.
                                </AlertDescription>
                            </Alert>

                            <Alert>
                                <DollarSign className="h-4 w-4" />
                                <AlertTitle>Outstanding Balances</AlertTitle>
                                <AlertDescription className="space-y-2">
                                    <p>This tenant has unpaid balances that should be settled before removal:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Unpaid rent</li>
                                        <li>Unpaid utility bills</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>

                            <Alert>
                                <FileWarning className="h-4 w-4" />
                                <AlertTitle>Security Deposit</AlertTitle>
                                <AlertDescription>
                                    This tenant has an active security deposit. Remember to process any deductions and return the
                                    remaining amount according to your agreement.
                                </AlertDescription>
                            </Alert>
                        </div>

                         <DialogFooter className="gap-1 sm:gap-3">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setCurrentStep(2)}>Continue to Checklist</Button>
                        </DialogFooter>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Pre-Removal Checklist</DialogTitle>
                            <DialogDescription>
                                Please confirm you have completed these steps before removing the tenant.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3 space-y-0">
                                <Checkbox
                                id="notice"
                                checked={confirmChecks.noticeSent}
                                onCheckedChange={() => handleCheckChange("noticeSent")}
                                />
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="notice" className="font-medium">
                                            Notice has been provided to tenant
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            I confirm that proper notice has been given according to the lease agreement and local laws.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 space-y-0">
                                    <Checkbox
                                    id="unpaid"
                                    checked={confirmChecks.unpaidChecked}
                                    onCheckedChange={() => handleCheckChange("unpaidChecked")}
                                    />
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="unpaid" className="font-medium">
                                            Outstanding balances have been addressed
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            I have checked for and addressed any unpaid rent, utilities, or other charges.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 space-y-0">
                                    <Checkbox
                                    id="deposit"
                                    checked={confirmChecks.depositHandled}
                                    onCheckedChange={() => handleCheckChange("depositHandled")}
                                    />
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="deposit" className="font-medium">
                                            Security deposit has been processed
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            I have completed the property inspection and processed the security deposit accordingly.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 space-y-0">
                                    <Checkbox
                                    id="keys"
                                    checked={confirmChecks.keysReturned}
                                    onCheckedChange={() => handleCheckChange("keysReturned")}
                                    />
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="keys" className="font-medium">
                                            Keys and access items returned
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            I have collected all keys, access cards, remote controls, and other property items.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="rounded-md border p-4">
                                <div className="font-medium flex items-center gap-2 mb-2">
                                    <Mail className="h-4 w-4" />
                                    Tenant Notification
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    After removal, we recommend sending a confirmation email to the tenant with:
                                </p>
                                <ul className="text-sm space-y-2">
                                    <li className="flex items-center gap-2">
                                        <CircleDashed className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                        <span>Final account statement</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CircleDashed className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                        <span>Security deposit settlement details</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CircleDashed className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                        <span>Confirmation of tenancy end date</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <DialogFooter className="gap-1 sm:gap-3">
                            <Button variant="outline" onClick={() => setCurrentStep(1)}>
                                Back
                            </Button>
                            <Button variant="destructive" onClick={() => mutate()} disabled={!allChecked || isPending} className="gap-1">
                                {isPending ? <LoadingSpinner /> : "Remove Tenant"}
                            </Button>
                        </DialogFooter>                        
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default RemoveTenant