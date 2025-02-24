import axiosFetch from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { createContext, PropsWithChildren, useContext } from 'react';

type AuthContextTypeState = {
    user: checkUser | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
}

const initalContextState: AuthContextTypeState = {
    user: undefined,
    isLoading: true,
    isLoggedIn: false,
}

const AuthContext = createContext<AuthContextTypeState>(initalContextState);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    return context
}

const AuthContextProvider = ({
    children
}: PropsWithChildren) => {
    const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            // return undefined if there is no access token??
            if(!localStorage.getItem('access_token')) return undefined
            const response = await axiosFetch.get('/auth/check').catch(() => undefined)
            
            if(!response) {
                return undefined
            }

            return response.data as checkUser
        },
        refetchOnWindowFocus: false
    })
    
    const value = {
        user: user,
        isLoading: isLoading,
        isLoggedIn: user ? true : false,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider