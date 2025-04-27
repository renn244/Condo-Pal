import handleValidationError, { ValidationError } from "@/lib/handleValidationError"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import LoadingSpinner from "../common/LoadingSpinner"
import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"

export const formSchema = z.object({
    title: z.string({ required_error: 'title is required' }).nonempty("title is required"),
    notes: z.string().optional(),
    cost: z.number({ required_error: 'cost is required' }),
    isPaid: z.boolean().optional(),
    category: z.enum(["UTILITY", "ASSOCIATION", "CLEANING", "OTHER"], {
        required_error: 'category is required',
    }),
    recurring: z.boolean({ required_error: 'recurring is required' }),
    recurrence: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]).optional(),
    billingMonth: z.string().regex(/^(0[1-9]|1[0-2])-\d{4}$/, {
        message: "billingMonth must be in MM-YYYY format with a valid month (01-12)",
    }).optional(),
}).superRefine(({ recurring, recurrence }, ctx) => {
    if(recurring && !recurrence) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "recurrence is required when recurring is true",
            path: ["recurrence"],
        })
    } 

    if(!recurring && recurrence) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "recurrence must be undefined when recurring is false",
            path: ['recurrence'],
        })
    }
})

type ExpenseFormProps = {
    isUpdate?: boolean,
    className?: string,
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    initialData?: expense 
}

const ExpenseForm = ({
    isUpdate,
    className,
    onsubmit, 
    initialData
}: ExpenseFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            notes: initialData?.notes || "",
            cost: initialData?.cost || 0,
            category: initialData?.category || "UTILITY",
            billingMonth: initialData?.billingMonth || undefined,
            recurrence: initialData?.recurrence || undefined,
            isPaid: initialData?.isPaid || false,
            recurring: initialData?.recurring || false,
        }
    })

    const buttonText = isUpdate ? "Save Changes" : "Add Expense" 

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            await onsubmit(data);
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleValidationError(error.response, error.response.data.errors, form.setError);
                return
            }

            toast.error(error.message);
        } finally {
            setIsLoading(false)
        }
    }

    const billingMonts = getAvailableBillingMonths();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4 ", className)}>
                <FormField 
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g: electric monthly bill" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-2 items-center gap-4">
                    <FormField 
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cost</FormLabel>
                            <FormControl>
                                <Input 
                                type="number" 
                                placeholder="e.g: 1500" {...field} 
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem> 
                    )}
                    />
                    <FormField 
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="mb-0">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="UTILITY">Utility</SelectItem>
                                        <SelectItem value="ASSOCIATION">Association</SelectItem>
                                        <SelectItem value="CLEANING">Cleaning</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <FormField 
                    control={form.control}
                    name="recurring"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recurring</FormLabel>
                            <FormControl>
                                <Select value={field.value ? "true" : "false"} onValueChange={(value) => field.onChange(value === "true")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Is this expense recurring?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Yes</SelectItem>
                                        <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    {form.watch("recurring") && (
                        <FormField 
                        control={form.control}
                        name="recurrence"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recurrence</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a recurrence" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                                            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                                            <SelectItem value="YEARLY">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    )}
                    {!form.watch("recurring") && (
                        <FormField
                        control={form.control}
                        name="billingMonth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billing Month</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a billing month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {billingMonts.map((month, idx) => (
                                                <SelectItem key={month} value={month}>
                                                    {month} {idx === 0 && "(now)"} 
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    )}
                </div>
                {!form.watch("recurring") && (
                    <FormField 
                    control={form.control}
                    name="isPaid"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>IsPaid</FormLabel>
                            <FormControl>
                                <Select value={field.value ? "true" : "false"} onValueChange={(value) => field.onChange(value === "true")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Is this expense is paid?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Yes</SelectItem>
                                        <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                This is used to track if the expense has been paid or not.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
                <FormField 
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                            <Textarea className="min-h-[100px] max-h-[250px]" {...field}
                            placeholder="e.g: electric bill that i pay in meralco, Document (#24)" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <div>
                    <Button className="w-full mt-4" disabled={isLoading} type="submit">
                        {isLoading ? <LoadingSpinner /> : buttonText}
                    </Button>
                </div>
            </form> 
        </Form>
    )
}

const getAvailableBillingMonths = () => {
    const currentDate = new Date();
    const billingMonths = [];

    for (let i = 0; i < 12; i++) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const formattedMonth = month.toLocaleString('default', { month: '2-digit' }) + '-' + month.getFullYear();
        billingMonths.push(formattedMonth);
    }

    return billingMonths;
}

export default ExpenseForm