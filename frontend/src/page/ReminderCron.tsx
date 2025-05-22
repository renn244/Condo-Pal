import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom"

/**
 * This is a cron job that runs on every day at 8:10 AM. triggered by the cron-job.org.com.
 * we put it here because we can't access the api backend directly because of monorepo structure that we have.
 * so we are relying on this page for that.
 * 
 * @Param it required a token as a search param. and that token is private and only one can access it only the cron-job.org.com
 */
const ReminderCron = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const { isLoading } = useQuery({
        queryKey: ['reminder', 'cron'],
        enabled: !!token,
        queryFn: async () => {
            const response = await axiosFetch.get('/reminder/Cron-PaymentReminder', {
                params: { token }
            })

            return response.data;
        }
    })

    if(!isLoading) return null

    if(!token) {
        return <Navigate to={'/404'} />
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="mx-auto max-w-md rounded-2xl border-red-200 shadow-lg">
                <CardHeader className="border-b border-red-100 bg-red-50">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <CardTitle className="text-red-700">System Page - Restricted Access</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4 text-center">
                        <p className="text-lg font-medium text-red-800">This page is not for public use.</p>
                        <p className="text-sm text-gray-600">
                            This area is restricted and intended for system operations only. You do not have permission to access or
                            view this content.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-red-100 bg-red-50 p-4">
                    <Link to="/">
                        <Button className="bg-primary hover:bg-primary/90">Return to Home</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ReminderCron