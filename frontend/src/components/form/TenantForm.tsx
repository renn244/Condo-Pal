import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import LoadingSpinner from "../common/LoadingSpinner"
import toast from "react-hot-toast"
import handleValidationError, { ValidationError } from "@/lib/handleValidationError"

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
            email: ""
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