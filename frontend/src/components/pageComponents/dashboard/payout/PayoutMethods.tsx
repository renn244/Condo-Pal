import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import axiosFetch from "@/lib/axios"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import PayoutMethodCard from "./payoutMethod/PayoutMethodCard"
import AddPayoutMethod from "./payoutMethod/AddPayoutMethod"

const PayoutMethods = () => {

    const { data, isLoading } = useQuery({
        queryKey: ['payout', 'methods'],
        queryFn: async () => {
            const response = await axiosFetch('/payout-method');

            if(response.status >= 400) {
                throw new Error('Something went wrong!');
            }

            return response.data as payoutMethods;
        }
    }) 

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payout Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    data && data.length > 0 ? (
                        data.map((method) => (
                            <PayoutMethodCard method={method} />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <p className="text-sm">No payout methods found.</p>
                        </div>
                    )
                )}
            </CardContent>
            <CardFooter className="border-t pt-4">
                <AddPayoutMethod />
            </CardFooter>
        </Card>
    )
}

export default PayoutMethods