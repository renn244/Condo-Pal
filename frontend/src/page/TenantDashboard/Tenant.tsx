import { Route, Routes } from "react-router-dom"
import Chat from "./Chat"
import TenantDashboard from "./TenantDashboard"

const Tenant = () => {
    return (
        <div className="min-h-[853px] flex">
            {/* Sidebar */}
            <main className="w-full min-h-[853px] p-4">
                <Routes>
                    <Route path="/chats" element={<Chat />} />
                    <Route path="/dashboard" element={<TenantDashboard />} />
                </Routes>
            </main>
        </div>
    )
}

export default Tenant