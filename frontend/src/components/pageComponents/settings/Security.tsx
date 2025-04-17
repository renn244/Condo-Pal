import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import axiosFetch from "@/lib/axios"
import handleValidationError, { ValidationError } from "@/lib/handleValidationError"
import { zodResolver } from "@hookform/resolvers/zod"
import { Key } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
    password: z.string().min(8, {
        message: "Password must be at least 8 characters"
    }),
    newPassword: z.string().min(8, {
        message: "Password must be at least 8 characters"
    }),
    confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters"
    }),
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
    if(newPassword !== confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            message: 'The passwords did not match',
            path: ['confirmPassword']
        })
    }
})

const Security = () => {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            newPassword: "",
            confirmPassword: ""
        }
    })
    
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.patch('/user/password', data);

            if(response.status === 400) {
                throw new ValidationError(response);
            }

            if(response.status >= 401) {
                throw new Error(response.data.message);
            }

            toast.success("Password updated successfully")
            form.reset();
        } catch(error: any) {
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
        <>
            <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Update your password to keep our account secure
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" className="gap-2">
                                    {isLoading ? (
                                        <LoadingSpinner />
                                    ) : ( 
                                        <>
                                            <Key className="h-4 w-4" />
                                            Update Password
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-1">
                            <p className="font-medium">Authenticator App</p>
                            <p className="text-sm text-muted-foreground">
                                Use an authenticator app to generate one-time codes
                            </p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-1">
                            <p className="font-medium">Text Message</p>
                            <p className="text-sm text-muted-foreground">Receive a code via SMS to verify your identity</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

        </>
    )
}

export default Security