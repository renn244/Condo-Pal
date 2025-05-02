import { useAuthContext } from "@/context/AuthContext";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import UserNav from "./UserNav";

const NavBar = () => {
    const { isLoggedIn, user } = useAuthContext()
    const dashboardLink = user?.role === 'landlord' ? '/dashboard/dashboard' : '/tenant/dashboard'

    return (
        <div className="flex items-center justify-between mx-4 mt-1 p-3 md:px-10 border-b-2 border-[#f3f3f3]">
            <div className="flex items-center gap-4 md:gap-16">
                <div aria-label="logo">
                    <Link to={'/'}>
                        <img src="/logo/Full_Logo.jpg" className="h-8 select-none pointer-events-none touch-none" />
                    </Link>
                </div>
                <div className="flex items-center justify-evenly gap-3" aria-label="links">
                    <NavLink 
                    className={({ isActive }) => `
                        px-2 py-1 select-none text-sm hover:bg-[#f3f3f3] rounded-full ${isActive ? 'bg-[#f3f3f3]' : ''}
                    `}
                    to={dashboardLink}>
                        Dashboard
                    </NavLink>
                    <NavLink
                    className={({ isActive }) => `
                        px-2 py-1 select-none text-sm hover:bg-[#f3f3f3] rounded-full ${isActive ? 'bg-[#f3f3f3]' : ''}
                    `}
                    to={'/aboutus'}>
                        About Us
                    </NavLink>
                    <NavLink 
                    className={({ isActive }) => `
                        px-2 py-1 select-none text-sm hover:bg-[#f3f3f3] rounded-full ${isActive ? 'bg-[#f3f3f3]' : ''}
                    `} 
                    to={'/pricing'}>
                        Pricing
                    </NavLink>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div aria-label="profile-sheet"  className="cursor-pointer">
                    {isLoggedIn ? (
                        <UserNav /> 
                    ) : (
                        <Button asChild>
                            <Link to={'/login'}>
                                Login
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NavBar