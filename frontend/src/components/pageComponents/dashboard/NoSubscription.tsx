import { Button } from "@/components/ui/button"
import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react"
import { Link } from "react-router-dom";

const NoSubscription = () => {

    const { data } = useQuery({
        queryKey: ["subscription", "latest"],
        queryFn: async () => {
            const response = await axiosFetch.get("/subscription/latest");

            if(response.status === 404) {
                return null;
            }

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data as getLatestSubscription;
        }
    })

    const isExpired = data === null ? false : true

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="pt-6 flex flex-col items-center max-w-md mx-auto">
                    <div className="bg-blue-100 p-4 rounded-full mb-6">
                        <ShieldAlert className="h-10 w-10 text-blue-600" />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Subscription Required</h2>

                    <p className="text-gray-600 mb-6">
                        {isExpired
                            ? "Your subscription has expired. Please renew to access this feature."
                            : "A subscription is required to access this feature."
                        }
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                        <Button className="w-full" asChild>
                            <Link to={'/pricing'}>
                                View Plans
                            </Link>
                        </Button>

                        {/* <Button variant="outline" className="w-full">
                            Go to Dashboard
                        </Button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoSubscription