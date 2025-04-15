import { useAuthContext } from '@/context/AuthContext'
import { PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom';
import Forbidden from '../Forbidden';

const LandlordRoute = ({
    children
}: PropsWithChildren) => {
    const { user, isLoggedIn } = useAuthContext();

    if(!user || !isLoggedIn) {
        const location = useLocation();
        const nextUrl = location.pathname;

        // redirect
        window.location.assign(`/login?next=${nextUrl}`);
        return
    }

    if(user.role !== 'landlord') {
        return <Forbidden message="This area is only for landlords" />
    }

    return children
}

export default LandlordRoute