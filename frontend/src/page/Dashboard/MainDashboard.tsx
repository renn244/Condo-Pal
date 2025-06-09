import FinancialOverview from "@/components/pageComponents/dashboard/mainDashboard/FinancialOverview"
import PendingRequests from "@/components/pageComponents/dashboard/mainDashboard/PendingRequests"
import PropertiesOverview from "@/components/pageComponents/dashboard/mainDashboard/PropertiesOverview"
import RecentNotification from "@/components/pageComponents/dashboard/mainDashboard/RecentNotification"
import SummaryCards from "@/components/pageComponents/dashboard/mainDashboard/SummaryCards"

const MainDashboard = () => {

    return (
        <div>
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-primary">
                    Main Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Welcome back to your property management dashboard
                </p>
            </header>

            {/* Summary Cards */}
            <SummaryCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Properties Overview */}
                    <PropertiesOverview />

                    {/* Financial Overview */}
                    <FinancialOverview />

                    {/* Maintenance Requests */}
                    <PendingRequests />
                </div>

                <div className="space-y-6">

                    {/* Notifications */}
                    <RecentNotification />

                </div>
            </div>
            
        </div>
    )
}

export default MainDashboard