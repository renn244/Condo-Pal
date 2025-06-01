import { useAuthContext } from '@/context/AuthContext'
import { PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'
import Forbidden from '../Forbidden'

const TenantRoute = ({
    children
}: PropsWithChildren) => {
    const { user, isLoggedIn }  = useAuthContext()
    const location = useLocation()

    
    if(!user || !isLoggedIn) {
        const nextUrl = location.pathname

        // redirect
        window.location.assign(`/login?next=${nextUrl}`)
        return
    }

    if(user.role !== 'tenant') {
        if(location.pathname === '/dashboard') {
            window.location.assign('/tenant/dashboard')
        }
        return <Forbidden message="This area is only for tenants and active(with leaseAgreement) tenants" />
    }

    return children
}

export default TenantRoute