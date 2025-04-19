import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useAuthContext } from "@/context/AuthContext"
import { BadgeCheck, Bell, Building2, CreditCard, Hotel, LayoutDashboard, LogOut, MessageSquare, Settings2, Sparkles, Wrench } from "lucide-react"
import { Link } from "react-router-dom"

const DashboardSidebar = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const { user } = useAuthContext();
    const { isMobile } = useSidebar();
    const location = window.location.pathname;
    const path = "/" + location.split("/").slice(1).join("/");

    const logOut = () => {
        // delete all the tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    
        window.location.reload();
    }
    
    const sidebarLinks = [
        { icon: LayoutDashboard, title: 'Dashboard', url: '/dashboard/dashboard' },
        { icon: Hotel, title: 'Condo', url: '/dashboard/condo' },
        { icon: Wrench , title: 'Maintenance', url: '/dashboard/maintenance' },
        { icon: CreditCard, title: 'Payments', url: '/dashboard/payments'  },
        { icon: MessageSquare, title: 'Chats', url: '/dashboard/chats' }
    ]

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Building2 className="size-4 font-thin" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">CondoPal</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {sidebarLinks.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton className="data-[active=true]:bg-primary data-[active=true]:text-white" isActive={path === item.url} asChild>
                                    <Link to={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton 
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user?.profile} alt={user?.name} />
                                <AvatarFallback className="rounded-lg">{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user?.name}</span>
                                <span className="truncate text-xs">{user?.email}</span>
                            </div>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user?.profile} alt={user?.name} />
                                        <AvatarFallback className="rounded-lg">{user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.name}</span>
                                        <span className="truncate text-xs">{user?.email}</span>
                                    </div>
                                </div> 
                                </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Sparkles />
                                    Upgrade to Pro
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <BadgeCheck />
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard />
                                    Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Bell />
                                    Notifications
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={'/settings/profile'}>
                                        <Settings2 />
                                        Setting
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logOut()}>
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar