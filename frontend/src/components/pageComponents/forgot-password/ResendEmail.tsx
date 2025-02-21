import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

const ResendEmail = () => {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string>('')

    const { mutate: resend, isPending } = useMutation({
        mutationKey: ['resend-email'],
        mutationFn: async () => {
            // ask the server to resend the email
            setError('')
            const response = await axiosFetch.post('/auth/forgot-password/resend', {
                email: searchParams.get('email')
            })

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data
        },
        onError: (error) => {
            setError(error.message)
        }
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Email Sent <CheckCircle className="text-green-500" />
                </CardTitle>
                <CardDescription>
                    We have sent an email to your account. Please check your email to reset your password.
                </CardDescription>
                {error ? (
                    <p className="text-muted-foreground">
                        Error: {" "}
                        <span className="text-red-500">
                            {error}
                        </span>
                    </p>
                ) : (
                    <p className="text-muted-foreground">
                        <span className="text-red-500">Warning:</span> {" "}
                        The email may be in your spam folder.
                    </p>
                )}
            </CardHeader>
            <CardFooter className="flex-col gap-2">
                <Button onClick={() => resend()} disabled={isPending} className="w-full">
                    {isPending ? <LoadingSpinner /> : "Resend Email"}
                </Button>
                <Button variant={"outline"} type="button" className="w-full" asChild>
                    <Link to={'/login'}>
                        Back to login
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ResendEmail