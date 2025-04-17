import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, useLocation } from "react-router-dom"
import { Bell, Building, CreditCard, HelpCircle, Lock, LogOut, Mail, User } from 'lucide-react'
import { useAuthContext } from "@/context/AuthContext"

// Navigation items
const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "property", label: "Property Settings", icon: Building },
    { id: "billing", label: "Billing", icon: CreditCard },
]

const Sidebars = () => {
    const { user } = useAuthContext();
    const location = useLocation();
    const activeTab = location.pathname.split("/").pop() || "profile";

    return (
        <>
            {/* Sidebar */}
            <div className="hidden md:block">
                <div className="flex flex-col gap-1 sticky top-24">
                    <div className="flex items-center gap-4 p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
                        <Avatar className="h-14 w-14 border-2 border-primary/10">
                            <AvatarImage src={user?.profile} alt={user?.name} />
                            <AvatarFallback className="text-lg">{user?.name?.charAt(0) || "A"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            <Badge variant="outline" className="mt-1 text-xs font-normal">
                                Professional Plan
                            </Badge>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm overflow-hidden">
                        {navItems.map((item) => (
                            <Link
                            key={item.id}
                            to={`/settings/${item.id}`}
                            className={`flex items-center w-full px-4 py-3 text-left transition-colors hover:bg-muted ${
                            activeTab === item.id
                                ? "bg-primary/5 border-l-2 border-primary font-medium"
                                : "border-l-2 border-transparent"
                            }`}
                            >
                                <item.icon className={`mr-3 h-4 w-4 ${activeTab === item.id ? "text-primary" : "text-muted-foreground"}`} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border shadow-sm overflow-hidden">
                        <div className="px-4 py-2 bg-muted/50">
                            <h3 className="font-medium text-sm">Support</h3>
                        </div>
                        <div className="divide-y">
                            <Link to="#" className="flex items-center px-4 py-3 text-sm hover:bg-muted transition-colors">
                                <HelpCircle className="mr-3 h-4 w-4 text-muted-foreground" />
                                <span>Help Center</span>
                            </Link>
                            <Link to="#" className="flex items-center px-4 py-3 text-sm hover:bg-muted transition-colors">
                                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                                <span>Contact Support</span>
                            </Link>
                        </div>
                    </div>

                    <Button variant="destructive" className="mt-6 gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden mb-6">
                <Tabs value={activeTab} className="w-full">
                    <TabsList className="w-full h-auto flex overflow-x-auto py-1 justify-start gap-2">
                        {navItems.map((item) => (
                            <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2 py-2" asChild>
                                <Link to={`/settings/${item.id}`}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>  
        </>
    )
}

export default Sidebars