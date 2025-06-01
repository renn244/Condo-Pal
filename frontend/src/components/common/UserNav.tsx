import { useAuthContext } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Skeleton } from "../ui/skeleton"

const UserNav = () => {
    const { user, isLoading } = useAuthContext();
    
    if(isLoading) {
        return <Skeleton className="h-9 w-9 rounded-full" />
    }

    if(!user) {
        return
    }

    const logOut = () => {
        // delete all the tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    
        location.reload();
    }

    // add functionlity later
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex" asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Avatar className="h-9 w-9">
                        <AvatarImage className="h-9 w-9 select-none" src={user.profile} />
                        <AvatarFallback>{user.name?.[0] || 'A'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => window.location.assign('/settings/billingInfo')}>
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.assign('/settings/profile')}>
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logOut()}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserNav