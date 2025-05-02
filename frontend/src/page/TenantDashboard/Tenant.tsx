import { Route, Routes, useLocation } from "react-router-dom"
import Chat from "./Chat"
import TenantDashboard from "./TenantDashboard"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import TenantSidebar from "../../components/pageComponents/tenantDashboard/TenantSidebar"
import GcashPayment from "./CondoPayment/GcashPayment"
import PaymongoPayment from "./CondoPayment/PaymongoPayment"
import VerifyPaymongoPayment from "./CondoPayment/VerifyPaymongoPayment"
import RequestMaintenance from "./RequestMaintenance"
import Notification from "@/components/pageComponents/common/Notification"

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
                            <Notification linkToAllNotifications="/tenant/allNotifications" />
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
                        </Routes>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default Tenant