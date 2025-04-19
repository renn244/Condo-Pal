import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axios"
import handleValidationError, { ValidationError } from "@/lib/handleValidationError"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }).optional(),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }).optional(),
    address: z.string().min(5, { message: "Address must be at least 5 characters." }).optional(),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional(),
    gcashNumber: z
    .string()
    .min(11, { message: "GCash number must be at least 11 digits." })
    .max(13, { message: "GCash number must not exceed 13 digits." })
    .regex(/^(\+63|0)9\d{9}$/, { message: "Please enter a valid GCash number (e.g., 09XXXXXXXXX or +639XXXXXXXXX)" })
    .optional(),
})

type BillingInfoProps = {
    initialFirstName?: string,
    initialLastName?: string,
    initialAddress?: string,
    initialPhoneNumber?: string,
    initialGcashNumber?: string,
}

const BillingInfo = ({
    initialFirstName,
    initialLastName,
    initialAddress,
    initialPhoneNumber,
    initialGcashNumber
}: BillingInfoProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: initialFirstName || "",
            lastName: initialLastName || "",
            address: initialAddress || "",
            phoneNumber: initialPhoneNumber || "",
            gcashNumber: initialGcashNumber || "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.patch("/user/billingInfo", data);

            if(response.status === 400) {
                throw new ValidationError(response);
            }

            if(response.status >= 401) {
                throw new Error(response.data.message);
            }

            toast.success("Billing information updated successfully.")

            // update the query
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleValidationError(error.response, error.response.data.errors, form.setError);
                return
            }

            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your billing details and payment information</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>

                        <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billing Address</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Enter your complete billing address"
                                    className="resize-none min-h-[80px]"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <Separator className="my-4" />

                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mt-0.5">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-600 dark:text-blue-400"
                                    >
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-800 dark:text-blue-300">
                                        GCash Payment Information
                                    </h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                        Your GCash number is used for receiving payments from tenants and processing refunds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <FormField
                        control={form.control}
                        name="gcashNumber"
                        render={({ field }) => (
                            <FormItem className="border p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/10">
                                <FormLabel className="text-blue-800 dark:text-blue-300">GCash Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                        placeholder="09XXXXXXXXX or +639XXXXXXXXX"
                                        className="pl-10 border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500"
                                        {...field}
                                        />
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400"
                                        >
                                            <rect width="20" height="14" x="2" y="5" rx="2" />
                                            <line x1="2" x2="22" y1="10" y2="10" />
                                        </svg>
                                    </div>
                                </FormControl>
                                <FormDescription className="text-blue-700 dark:text-blue-400">
                                    Enter your GCash number in the format 09XXXXXXXXX or +639XXXXXXXXX
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" className="gap-2">
                                {isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Billing Information
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default BillingInfo