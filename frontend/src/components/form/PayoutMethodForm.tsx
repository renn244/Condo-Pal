import handleValidationError, { ValidationError } from "@/lib/handleValidationError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import LoadingSpinner from "../common/LoadingSpinner";

export const formSchema = z.object({
    methodType: z.string().nonempty("Method type is required"),
    mobileNumber: z.string().nonempty("Mobile number is required"),
    accountName: z.string().nonempty("Account name is required"),
})

type PayoutMethodFormProps = {
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    className?: string,
    initialData?: z.infer<typeof formSchema>,
    isUpdate?: boolean,
}

const PayoutMethodForm = ({
    onsubmit,
    className,
    initialData,
    isUpdate = false
}: PayoutMethodFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            methodType: initialData?.methodType || '',
            mobileNumber: initialData?.mobileNumber || '',
            accountName: initialData?.accountName || '',
        }
    })

    const buttonText = isUpdate ? "Save Changes" : "Add Payout Method";

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await onsubmit(data)
        } catch (error: any) {
            if (error instanceof ValidationError) {
                handleValidationError(error.response, error.response.data.errors, form.setError);
                return;
            }

            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
                <FormField 
                control={form.control}
                name="methodType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Method Type</FormLabel>
                        <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Method type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GCASH">Gcash</SelectItem>
                                    <SelectItem value="MAYA">Maya</SelectItem>
                                    <SelectItem value="GRABPAY">GrabPay</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField 
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" placeholder="e.g, 09123456789" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField 
                control={form.control}
                name="accountName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g, Juan Dela Cruz" />
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

export default PayoutMethodForm