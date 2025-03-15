import { CreditCard, Hotel, LayoutDashboard, Wrench } from "lucide-react"
import { NavLink } from "react-router-dom"

const DashboardSidebar = () => {

    const sidebarLinks = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/dashboard' },
        { icon: Hotel, label: 'Condo', href: '/dashboard/condo' },
        { icon: Wrench , label: 'Maintenance', href: '/dashboard/maintenance' },
        { icon: CreditCard, label: 'Payments', href: '/dashboard/payments'  }
    ]

    return (
        <div className="min-h-[851px] flex flex-col h-auto bg-primary text-primary-foreground w-64 py-8 px-4">
            <nav className="flex-1">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-center">Dashboard</h1>
                </div>
                <ul className="space-y-1">
                    {sidebarLinks.map((item) => (
                        <li key={item.label}>
                            <NavLink
                            to={item.href}
                            className={({ isActive }) => `
                                flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors ${isActive ? "bg-blue-700" : ""}
                            `}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default DashboardSidebar