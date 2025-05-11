import Notification from "@/components/pageComponents/common/Notifications/Notification"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Route, Routes, useLocation } from "react-router-dom"
import TenantSidebar from "../../components/pageComponents/tenantDashboard/TenantSidebar"
import Chat from "./Chat"
import GcashPayment from "./CondoPayment/GcashPayment"
import PaymongoPayment from "./CondoPayment/PaymongoPayment"
import VerifyPaymongoPayment from "./CondoPayment/VerifyPaymongoPayment"
import RequestMaintenance from "./RequestMaintenance"
import TenantDashboard from "./TenantDashboard"
import AllNotifications from "../AllNotifications"

const Tenant = () => {
    const location = useLocation();
    const path = location.pathname.split("/").slice(2).join("/");

    return (
        <div className="min-h-[853px] flex">
            <SidebarProvider>
                <TenantSidebar />
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
                                                Tenant
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
                            <Notification linkToAllNotifications="/tenant/all-notifications" />
                        </div>
                    </header>
                    <main className="flex-1 p-4">
                        <Routes>
                            <Route path="/chats" element={<Chat />} />
                            <Route path="/dashboard" element={<TenantDashboard />} />
                            <Route path='/gcash/:condoId' element={<GcashPayment />} />
                            <Route path='/paymongo/:condoId' element={<PaymongoPayment />} />
                            <Route path='/paymongo/verify' element={<VerifyPaymongoPayment />} />

                            <Route path='/maintenanceRequest' element={<RequestMaintenance />} />

                            <Route path='/all-notifications' element={<AllNotifications />} />
                        </Routes>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default Tenant