import PricingCard from "@/components/common/PricingCard";
import StartTrialButton from "@/components/common/StartTrialButton";
import { useAuthContext } from "@/context/AuthContext";
import axiosFetch from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Pricing = () => {
    // "Starter" is the plan type the backend stores
    const plan = {
        type: "Starter",
        title: "CondoPal",
        description: "Everything you need to manage your condos",
        monthlyPrice: 450,
        features: [
            "Unlimited condos and tenants",
            "Rent payments by GCash or manual entry",
            "Maintenance requests and tracking",
            "Expense tracking",
            "Chat with tenants",
            "Dashboard and payment history",
        ],
        buttonText: "Get Started",
    };

    const { user, isLoggedIn } = useAuthContext();
    const isLandlord = user?.role === 'landlord';

    // the trial is for accounts that never had a subscription (latest returns 404)
    const { data: latestSubscription } = useQuery({
        queryKey: ["subscription", "latest"],
        queryFn: async () => {
            const response = await axiosFetch.get("/subscription/latest", { validateStatus: () => true });
            if(response.status === 404) return null;
            if(response.status >= 400) throw new Error(response.data.message);
            return response.data as getLatestSubscription;
        },
        enabled: isLandlord,
        refetchOnWindowFocus: false
    })

    const canStartTrial = !isLoggedIn || (isLandlord && latestSubscription === null);

    const { mutate, isPending } = useMutation({
        mutationKey: ['pricing', 'generatePayment'],
        mutationFn: async (type: string) => {
            const response = await axiosFetch.post('/subscription/generatePayment', {
                type: type
            }, { validateStatus: () => true })
            
            if(response.status === 401) {
                window.location.assign('/login?next=/pricing');
                return null;
            }

            if(response.status >= 400) throw new Error(response.data.message);
            
            return response.data
        },
        onError: (error) => {
            return toast.error(error.message)
        },
        onSuccess: (data) => {
            // A guest is redirected above, so there is no checkout URL to open.
            if(!data) return;
            window.location.assign(data.attributes.checkout_url)
        }
    })

    return (
        <div className="">
            <div className="px-4 py-16 md:py-20 mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-700 to-blue-900 sm:text-5xl mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-blue-600">One plan with every feature. Always know what you'll pay.</p>
                </div>

                <div className="max-w-md mx-auto">
                    <PricingCard
                    title={plan.title}
                    description={plan.description}
                    monthlyPrice={plan.monthlyPrice}
                    features={plan.features}
                    buttonText={plan.buttonText}
                    isLoading={isPending}
                    onButtonClick={() => mutate(plan.type)}
                    />
                    {canStartTrial && (
                        <StartTrialButton className="mt-4" />
                    )}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-muted-foreground">
                        {canStartTrial ? "Try it free for 14 days, no payment needed. After that, ₱450 a month through PayMongo." : "Billed monthly through PayMongo."}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Pricing
