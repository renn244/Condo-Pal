import LoadingSpinner from "@/components/common/LoadingSpinner"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import axiosFetch from "@/lib/axios"
import formatDateTime from "@/lib/formatDateTime"
import { useQuery } from "@tanstack/react-query"
import { AlertCircle, Mail, MessageSquare, Phone } from "lucide-react"
import { Link } from "react-router-dom"

const TenantNotice = () => {
    const { data: leaseAgreement, isLoading, error, refetch } = useQuery({
        queryKey: ["tenant", "lease-agreement", "latest-ended"],
        queryFn: async () => {
            const response = await axiosFetch.get(`/lease-agreement/latestEnded`);

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data as getLatestLeaseEndedAgreement;
        }
    })

    if(isLoading) return <LoadingSpinner />

    if(error || !leaseAgreement) return <SomethingWentWrong reset={refetch} />

    // if the leaseAgreement hasn't ended yet, show a message
    if(!leaseAgreement.leaseEnd) {
        return <SomethingWentWrong reset={refetch} 
        message={"The Lease Agreement hasn't ended yet. Please called support as this is a bug."} />
    }

    return (
        <Card className="border-red-200 bg-red-50 mb-6">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-red-700">Your Tenant Status Has Changed</CardTitle>
                </div>
                <CardDescription className="text-red-700/70">
                    You have been removed from {leaseAgreement.condo.name} by {leaseAgreement.condo.owner.name} {" "} 
                    on {formatDateTime(new Date(leaseAgreement.leaseEnd))}. Remove from this property in this system.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert variant="destructive" className="bg-white border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important Notice</AlertTitle>
                    <AlertDescription>
                        Please check your email and notifications for important information from your landlord regarding this
                        change.
                    </AlertDescription>
                </Alert>

                <div className="space-y-2">
                    <h4 className="font-medium text-red-700">What This Means:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-red-700/80">
                        <li>You no longer have tenant access to this property in the system</li>
                        <li>Any pending maintenance requests may have been canceled</li>
                        {/* {hasUnpaidBalances && (
                            <li className="font-medium">You have outstanding balances that need to be resolved</li>
                        )} */}
                        <li>You should coordinate with your landlord regarding move-out procedures</li>
                    </ul>
                </div>

                <Separator className="bg-red-200" />

                <div className="space-y-2">
                    <h4 className="font-medium text-red-700">Next Steps:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-red-700/80">
                        <li>Check your email for detailed information from your landlord</li>
                        <li>Review your notifications for any outstanding items</li>
                        <li>Contact your landlord to discuss move-out arrangements</li>
                        <li>Download any records you may need for your files</li>
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
                <Button variant="outline" className="w-full sm:w-auto border-red-200 bg-white hover:bg-red-100 text-red-700" asChild>
                    <Link to={'https://mail.google.com/mail/u/0/#inbox'} target="_blank">
                        <Mail className="mr-2 h-4 w-4" />
                        Check Email
                    </Link>
                </Button>
                <Button variant="outline" className="w-full sm:w-auto border-red-200 bg-white hover:bg-red-100 text-red-700" asChild>
                    <Link to={`/tenant/chats?leaseAgreementId=${leaseAgreement.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Landlord
                    </Link>
                </Button>
                <Button variant="outline" className="w-full sm:w-auto border-red-200 bg-white hover:bg-red-100 text-red-700" asChild>
                    <Link to={'/contact'} onClick={() => window.scrollTo(0, 0)}>
                        <Phone className="mr-2 h-4 w-4" />
                        Support
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default TenantNotice