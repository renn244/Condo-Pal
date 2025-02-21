import LoadingSpinner from "@/components/common/LoadingSpinner";
import InputPassword from "@/components/common/PasswordInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import axiosFetch from "@/lib/axios";
import handleValidationError from "@/lib/handleValidationError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";

// this page will be used when the email is clicked that is sent from the ForgotPassword page
const formSchema = z.object({
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    email: z.string().email(),
    token: z.string()
})
// .superRefine(({ password, confirmPassword}, ctx) => {
//     if(password !== confirmPassword) {
//         ctx.addIssue({
//             code: 'custom',
//             message: 'The passwords did not match',
//             path: ['confirmPassword']
//         })
//     }
// })

const ResetForgottenPassword = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
            email: searchParams.get("email") || '',
            token: searchParams.get("token") || '',
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.post('/auth/forgot-password/reset', data)

            if(response.status === 400) {
                handleValidationError(response, response.data.errors, form.setError)
                return
            }

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            localStorage.setItem("refresh_token", response.data.refresh_token)
            localStorage.setItem("access_token", response.data.access_token)

            window.location.assign("/")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Card className="w-[470px]">
                <CardHeader>
                    <CardTitle>
                        Reset Password
                    </CardTitle>
                    <CardDescription>
                        Create a new password for your account. make sure to remember it
                    </CardDescription>
                    <CardDescription>
                        Note: The link will expire in 1 hour.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <FormField 
                            control={form.control}
                            name="token"
                            render={() => (
                                <FormItem>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <InputPassword {...field} />
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
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <InputPassword {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button disabled={isLoading} type="submit" className="w-full mt-3">
                                {isLoading ? <LoadingSpinner /> : "Reset Password"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="flex text-sm space-x-1 justify-center w-full">
                        <p>Did you remember it already? </p>
                        <Link to="/login" className="font-medium text-primary underline-offset-2 hover:underline">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ResetForgottenPassword