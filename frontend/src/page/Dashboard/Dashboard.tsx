import DashboardSidebar from "@/components/pageComponents/dashboard/Sidebar"
import { Route, Routes } from "react-router-dom"
import Condo from "./Condo"
import Maintenance from "./Maintenance"
import Payments from "./Payments"
import ViewCondo from "./ViewCondo"

const Dashboard = () => {
    return (
        <div className="min-h-[853px] flex">
            <DashboardSidebar />
            <main className="w-full min-h-[853px] p-4">
                <Routes>
                    <Route path="/dashboard" element={undefined} />
                    <Route path="/condo" element={<Condo />} />
                    <Route path="/condo/:condoId" element={<ViewCondo />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/payments" element={<Payments />} />
                </Routes>
            </main>
        </div>
    )
}

export default Dashboard