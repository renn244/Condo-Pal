import { Settings2 } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Toggle } from '../ui/toggle';
import UserNav from "./UserNav";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "../ui/button";

const NavBar = () => {
    const { isLoggedIn } = useAuthContext()

    return (
        <div className="flex items-center justify-between mx-4 mt-1 p-3 px-10 border-b-2 border-[#f3f3f3]">
            <div className="flex items-center gap-16">
                <div aria-label="logo">
                    <Link to={'/'}>
                        <h1 className="text-xl font-bold select-none cursor-pointer">
                            CONDOPAL
                        </h1>
                    </Link>
                </div>
                <div className="flex items-center justify-evenly gap-3" aria-label="links">
                    <NavLink 
                    className={({ isActive }) => `
                        px-2 py-1 select-none text-sm hover:bg-[#f3f3f3] rounded-full ${isActive ? 'bg-[#f3f3f3]' : ''}
                    `} 
                    to={'Dashboard'}>
                        Dashboard
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
                <div aria-label="settings">
                    <Toggle pressed={false} asChild>
                        <Settings2 className="text-muted-foreground h-5 w-5" />
                    </Toggle>
                </div>
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