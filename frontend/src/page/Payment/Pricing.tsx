import PricingCard from "@/components/common/PricingCard";
import axiosFetch from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Pricing = () => {
    const pricingPlans = [
        {
            title: "Starter",
            description: "Perfect for side projects",
            monthlyPrice: 9,
            features: ["5 projects", "10GB storage", "Basic analytics", "Email support"],
            buttonText: "Get Started",
        },
        {
            title: "Pro",
            description: "For growing businesses",
            monthlyPrice: 29,
            features: [
                "Unlimited projects",
                "100GB storage",
                "Advanced analytics",
                "Priority support",
                "Custom domains",
                "Team collaboration",
            ],
            buttonText: "Get Started",
            mostPopular: true,
        },
        {
            title: "Enterprise",
            description: "For large organizations",
            monthlyPrice: 99,
            features: [
                "Unlimited everything",
                "Advanced security",
                "Custom integrations",
                "24/7 phone support",
                "SLA guarantee",
                "Dedicated account manager",
            ],
            buttonText: "Contact Sales",
        },
    ];

    const { mutate, isPending, variables } = useMutation({
        mutationKey: ['pricing', 'generatePayment'],
        mutationFn: async (type: string) => {
            const response = await axiosFetch.post('/subscription/generatePayment', {
                type: type
            }, { validateStatus: () => true })
            
            if(response.status === 401) {
                return location.assign('/login?next=/pricing')
            }

            if(response.status >= 400) throw new Error(response.data.message);
            
            return response.data
        },
        onError: (error) => {
            return toast.error(error.message)
        },
        onSuccess: (data) => {
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
                    <p className="text-xl text-blue-600">Choose the perfect plan for your needs. Always know what you'll pay.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingPlans.map((plan, idx) => (
                        <PricingCard 
                        key={idx}
                        title={plan.title}
                        description={plan.description}
                        monthlyPrice={plan.monthlyPrice}
                        features={plan.features}
                        buttonText={plan.buttonText}
                        mostPopular={plan.mostPopular}
                        isLoading={isPending && variables === plan.title}
                        onButtonClick={mutate}
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-muted-foreground">
                        All plans include 14-day free trial. No credit card required.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Pricing