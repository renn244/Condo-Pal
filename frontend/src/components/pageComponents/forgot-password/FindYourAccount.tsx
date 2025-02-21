import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosFetch from "@/lib/axios";
import handleValidationError from "@/lib/handleValidationError";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

type emailForm = {
    email: string;
}

type FindYourAccountProps = {
    setIsSent: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindYourAccount = ({
    setIsSent
}: FindYourAccountProps) => {
    const [_, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, setError, formState: { errors } } = useForm<emailForm>();
    
    const onSubmit: SubmitHandler<emailForm> = async (data) => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.post('/auth/forgot-password', data)

            if(response.status === 400) {
                handleValidationError(response, response.data.errors, setError)
                return 
            }

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            setIsSent(true)
            setSearchParams({ email: data.email })
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="">
                <CardHeader>
                    <CardTitle>
                        Find your account
                    </CardTitle>
                    <CardDescription>
                        Please enter your email address to search for your account.
                        We will send an email for you to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        <Label className={`${errors.email ? 'text-red-500 text-sm' : ''}`}>Email</Label>
                        <div>
                            <Input {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Invalid email address'
                                }
                            })} type="text" placeholder="example@gmai.com" />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <LoadingSpinner /> : "Send Email"}
                    </Button>
                    <Button type="button" variant={'outline'} className="w-full" asChild>
                        <Link to={'/login'}>
                            Cancel
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default FindYourAccount