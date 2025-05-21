import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import SubscriptionExpiredDialog from "@/components/pageComponents/dashboard/SubscriptionExpiredDialog";
import NoSubscription from "@/components/pageComponents/dashboard/NoSubscription";
import { useLocation } from "react-router-dom";

type SubscriptionSocketContextType = {
    isLoading: boolean;
    isActive: boolean;
    daysRemaining: number | null;
    checkSubscription: () => boolean;
}

const initialState: SubscriptionSocketContextType = {
    isLoading: true,
    isActive: false,
    daysRemaining: null,
    checkSubscription: () => false,
}

const SubscriptionContext = createContext<SubscriptionSocketContextType>(initialState);

export const useSubscriptionContext = () => {
    return useContext(SubscriptionContext);
}

export const SubscriptionProvider = ({
    children
}: PropsWithChildren) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
    
    const { pathname } = useLocation();
    const { user, isLoading } = useAuthContext();

    const checkSubscription = () => {
        if(!user) return false;

        const subscription = user.subscriptions?.[0];
        const isActive = subscription ? true : false;
        setIsActive(isActive);

        if(subscription?.expiresAt) {
            const today = new Date();
            const diffTime = new Date(subscription.expiresAt).getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(diffDays);
        }

        return isActive;
    }

    const exludedPaths = ['/payout', '/chats']

    useEffect(() => {
        if(!user) return;
        
        checkSubscription();
        
    }, [user]);

    useEffect(() => {
        if(isActive === false) {
            setShowDialog(true);
        } else {
            setShowDialog(false);
        }
    }, [isActive])

    const value = {
        isLoading,
        isActive,
        daysRemaining,
        checkSubscription,
    }

    if(isLoading) return null;

    const isNotAllowed = (!isActive && !exludedPaths.some((path) => pathname.endsWith(path)))

    return (
        <SubscriptionContext.Provider value={value}>
            {isNotAllowed ? (
                <NoSubscription />                
            ) : (
                children
            )}
            {isNotAllowed && <SubscriptionExpiredDialog open={showDialog} onOpenChange={setShowDialog} />}
        </SubscriptionContext.Provider>
    )
}