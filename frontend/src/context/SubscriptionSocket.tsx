import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";

type SubscriptionSocketContextType = {
    isLoading: boolean;
    isActive: boolean;
    daysRemaining: number | null;
    checkSubscription: () => Promise<boolean>;
}

const initialState: SubscriptionSocketContextType = {
    isLoading: true,
    isActive: false,
    daysRemaining: null,
    checkSubscription: async () => false,
}

const SubscriptionContext = createContext<SubscriptionSocketContextType>(initialState);

export const useSubscriptionContext = () => {
    return useContext(SubscriptionContext);
}

export const SubscriptionProvider = ({
    children   
}: PropsWithChildren) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    const { user, isLoading } = useAuthContext();

    const checkSubscription = async () => {
        if(!user) return false;

        const subscription = user.subscriptions?.[0];

        const isActive = subscription ? true : false;
        setIsActive(isActive);

        if(subscription.expiresAt) {
            const today = new Date();
            const diffTime = new Date(subscription.expiresAt).getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(diffDays);
        }

        return isActive;
    }

    useEffect(() => {
        if(!user) return;
        
        checkSubscription();
    }, [user])

    useEffect(() => {

    }, [isActive])

    const value = {
        isLoading,
        isActive,
        daysRemaining,
        checkSubscription,
    }

    if(isLoading) return null;

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    )
}