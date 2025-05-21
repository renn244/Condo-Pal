import Notification from "@/components/pageComponents/common/Notifications/Notification"
import DashboardSidebar from "@/components/pageComponents/dashboard/Sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Route, Routes, useLocation } from "react-router-dom"
import Chat from "./Chat"
import Condo from "./Condo"
import ManualPayment from "./CondoPayment/ManualPayment"
import VerifyGcashPayment from "./CondoPayment/VerifyGcashPayment"
import MainDashboard from "./MainDashboard"
import Maintenance from "./Maintenance"
import Payments from "./Payments"
import RequestMaintenance from "./RequestMaintenance"
import ViewCondo from "./ViewCondo"
import AllNotifications from "../AllNotifications"
import EditMaintenance from "./EditMaintenance"
import Payout from "./Payout"
import { SubscriptionProvider } from "@/context/SubscriptionContext"

const Dashboard = () => {
    const location = useLocation();
    const path = location.pathname.split("/").slice(2).join("/");

    return (
        <div className="min-h-[853px] flex">
            <SidebarProvider>
                <DashboardSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
                        <div className="flex items-center justify-between px-4 w-full">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">
                                                Landlord
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {path}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>

                            <Notification linkToAllNotifications="/dashboard/all-notifications" />
                        </div>
                    </header>
                    <main className="w-full min-h-[853px] p-4">
                        <SubscriptionProvider>
                            <Routes>
                                <Route path="/dashboard" element={<MainDashboard />} />
                                <Route path="/condo" element={<Condo />} />
                                <Route path="/condo/:condoId" element={<ViewCondo />} />
                                <Route path="/maintenance" element={<Maintenance />} />
                                <Route path="/payments" element={<Payments />} />
                                <Route path="/chats" element={<Chat />} />
                                <Route path="/payout" element={<Payout />} />
    
                                <Route path="/maintenanceRequest/:condoId" element={<RequestMaintenance />} />
                                <Route path="/editMaintenance/:maintenanceId" element={<EditMaintenance />} />

                                {/* Condo Payments */}
                                <Route path="/manual/:condoId" element={<ManualPayment />} />
                                <Route path="/gcash/verify/:condoPaymentId" element={<VerifyGcashPayment />} />

                                <Route path="/all-notifications" element={<AllNotifications />} />
                            </Routes>
                        </SubscriptionProvider>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default Dashboard