import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import handleValidationError, { ValidationError } from "@/lib/handleValidationError"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import LoadingSpinner from "../common/LoadingSpinner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

// use for the add tenant in the condo card
export const formSchema = z.object({
    email: z.string().nonempty({
        message: 'Email is required'
    }).email({
        message: 'Please enter a valid email address',
    }),
    name: z.string().nonempty({
        message: 'name is required'
    }),
    due_date: z.number({
        required_error: 'Due date is required'
    })
})

type TenantFormProps = {
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    className?: string,
}

const TenantForm = ({
    onsubmit,
    className,
}: TenantFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            due_date: -1,
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            await onsubmit(data);
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleValidationError(error.response, error.response.data.errors, form.setError)
                return
            }
            
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
                <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="example@gmail.com" {...field} />
                        </FormControl>
                        <FormDescription>
                            The tenant's personal email where they can be notified of certain events.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="John Doe Rogan" {...field} />
                        </FormControl>
                        <FormDescription>
                            The Tenant's real name so that we can easily identify them.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField 
                control={form.control}
                name="due_date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Days Due Date</FormLabel>
                        <FormControl>
                            <Select value={field.value.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Day" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Days</SelectLabel>
                                        {Array.from({ length: 28 }, (_, i) => {
                                            if(i < 14) return null

                                            return (
                                                <SelectItem className="hover:bg-muted" key={i} value={(i + 1).toString()}>
                                                    {i + 1}
                                                </SelectItem>
                                            )
                                        })}
                                        <SelectItem className="hover:bg-muted" value="-1">last day of the month</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormDescription>
                            The day when the tenant's payment is due everymonth. This is used to calculate the payment schedule.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <div>
                    <Button className="w-full mt-4" disabled={isLoading} type="submit">
                        {isLoading ? <LoadingSpinner /> : "Create Tenant"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default TenantForm