import { useAuthContext } from "@/context/AuthContext"
import { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

const AuthenticatedRoute = ({
    children
}: PropsWithChildren) => {
    const { isLoggedIn } = useAuthContext();

    if(!isLoggedIn) {
        const location = useLocation();
        const nextUrl = location.pathname;
        
        // redirect
        window.location.assign(`/login?next=${nextUrl}`)
        return
    }

    return children
}

export default AuthenticatedRoute