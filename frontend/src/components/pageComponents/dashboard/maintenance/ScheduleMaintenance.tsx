import DateTimePicker from "@/components/common/DateTimePicker";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PaymentResponsibility } from "@/constant/maintenance.constants";
import axiosFetch from "@/lib/axios";
import handleValidationError, { ValidationError } from "@/lib/handleValidationError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, Copy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type ScheduleMaintenanceProps = {
    maintenanceId: string,
    maintenanceTitle: string,
    maintenancePrefferredSchedule?: string,
    queryKey: any[]
}

const formSchema = z.object({
    estimatedCost: z.number().optional(),
    scheduledDate: z.date({
        required_error: "Scheduled date is required"
    }),
    paymentResponsibility: z.nativeEnum(PaymentResponsibility, {
        required_error: "Payment responsibility is required"
    }),
    manualLink: z.boolean(),
    workerEmail: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal("")).optional(),
    additionalNotes: z.string().optional()
}).superRefine((data, ctx) => {
    if(!data.manualLink && !data.workerEmail) {
        ctx.addIssue({
            code: 'custom',
            path: ['workerEmail'],
            message: 'Worker email is required when manuallink is false',
        })
    }
})

const ScheduleMaintenance = ({
    maintenanceId,
    maintenanceTitle,
    maintenancePrefferredSchedule,
    queryKey,
}: ScheduleMaintenanceProps) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            paymentResponsibility: PaymentResponsibility.TENANT,
            manualLink: false,
            scheduledDate: maintenancePrefferredSchedule ? new Date(maintenancePrefferredSchedule) : new Date(), // this should be defaulted for preferred schedule by tenant
            workerEmail: "",
        }
    })

    const isManualLink = form.getValues("manualLink");
    const magicLink = `https://condopal.com/maintenance/worker/${maintenanceId}?token=maint_${Math.random().toString(36).substring(2, 15)}`;

    const copyMagicLink = () => {
        navigator.clipboard.writeText(magicLink)
        toast.success("link copied!");
    }

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.patch(`/maintenance/schedule?maintenanceId=${maintenanceId}`, values)

            if(response.status === 400) {
                throw new ValidationError(response);
            }

            if(response.status >= 401) {
                throw new Error(response.data.message);
            }

            toast.success("Maintenance scheduled successfully");
            setOpen(false);
            await queryClient.setQueryData(queryKey, (oldData: MaintenanceRequest) => {
                return {
                    ...oldData,
                    maintenanceRequests: oldData.maintenanceRequests.map((maintenance: any) => {
                        if(maintenance.id === maintenanceId) {
                            return {
                                ...maintenance,
                                Status: 'SCHEDULED',
                                scheduledDate: values.scheduledDate,
                                paymentResponsibility: values.paymentResponsibility,
                                estimatedCost: values.estimatedCost,
                            }
                        }
                        return maintenance
                    })
                }
            })
        } catch (error) {
            if(error instanceof ValidationError) {
                handleValidationError(error.response, error.response.data.errors, form.setError);
                return
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    Schedule Maintenance
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogHeader>
                        <DialogTitle>Schedule Maintenance</DialogTitle>
                        <DialogDescription>
                            Schedule maintenance for {maintenanceTitle}
                        </DialogDescription>
                    </DialogHeader>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                        <FormField
                        control={form.control}
                        name="estimatedCost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estimated Cost</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} 
                                    onChange={(e) => field.onChange(+e.target.value)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={() => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Scheduled Date</FormLabel>
                                <FormControl>
                                    <DateTimePicker form={form} field="scheduledDate" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="paymentResponsibility"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Responsibility</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment responsibility" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={PaymentResponsibility.LANDLORD}>Landlord</SelectItem>
                                        <SelectItem value={PaymentResponsibility.TENANT}>Tenant</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField 
                        control={form.control}
                        name="manualLink"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                                <FormControl>
                                    <Checkbox className="mb-0 size-4 ml-1" 
                                    ref={field.ref} name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel>Send ManualLink</FormLabel>
                            </FormItem>
                        )}
                        />

                        {isManualLink ? (
                            <div className="space-y-2">
                                <Label>Magic Link</Label>
                                <div className="flex space-x-2">
                                    <Input value={magicLink} readOnly className="text-xs" />
                                    <Button type="button" variant="outline" size="icon" onClick={copyMagicLink}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Alternatively, share this link with the maintenance worker for direct access.
                                </p>
                            </div>
                        ) : (
                            <FormField
                            control={form.control}
                            name="workerEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assigned Worker Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="worker@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription className="text-xs">Email notification will be sent to this address when scheduled</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                            /> 
                        )}

                        {!isManualLink && (
                            <FormField
                            control={form.control}
                            name="additionalNotes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        className="max-h-[200px]"
                                        placeholder="Add any additional information about the scheduled maintenance..."
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">Additional notes that will be added in the email</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <LoadingSpinner /> : "Update Status"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ScheduleMaintenance