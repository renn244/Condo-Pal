import { useAuthContext } from '@/context/AuthContext'
import { PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'
import Forbidden from '../Forbidden'

const TenantRoute = ({
    children
}: PropsWithChildren) => {
    const { user, isLoggedIn }  = useAuthContext()
    
    if(!user || !isLoggedIn) {
        const location = useLocation()
        const nextUrl = location.pathname

        // redirect
        window.location.assign(`/login?next=${nextUrl}`)
        return
    }

    if(user.role !== 'tenant') {
        return <Forbidden message="This area is only for tenants and active(not deleted) tenants" />
    }

    return children
}

export default TenantRoute