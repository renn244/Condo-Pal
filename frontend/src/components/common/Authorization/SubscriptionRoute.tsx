import { PropsWithChildren } from "react"

type SubscriptionRouteProps = {
    subscription: "Starter" | "Pro" | "Enterprise",
    allowedSubscription: ("Starter" | "Pro" | "Enterprise")[],
} & PropsWithChildren

const SubscriptionRoute = ({
    subscription,
    allowedSubscription,
    children
}: SubscriptionRouteProps) => {

    if(!allowedSubscription.includes(subscription)) {
        return <div>
            your subscription does not reach here
        </div>
    }

    return children
}

export default SubscriptionRoute