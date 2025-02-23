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

    // add functionlity later
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex" asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Avatar className="h-9 w-9">
                        <AvatarImage className="h-9 w-9 select-none" src={user.profile} />
                        <AvatarFallback></AvatarFallback>
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
                    <DropdownMenuItem>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserNav