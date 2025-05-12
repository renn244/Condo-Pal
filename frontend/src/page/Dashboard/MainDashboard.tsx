import FinancialOverview from "@/components/pageComponents/dashboard/mainDashboard/FinancialOverview"
import PendingRequests from "@/components/pageComponents/dashboard/mainDashboard/PendingRequests"
import PropertiesOverview from "@/components/pageComponents/dashboard/mainDashboard/PropertiesOverview"
import RecentNotification from "@/components/pageComponents/dashboard/mainDashboard/RecentNotification"
import SummaryCards from "@/components/pageComponents/dashboard/mainDashboard/SummaryCards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, FileText, Plus, Wallet } from "lucide-react"

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
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Property
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <DollarSign className="mr-2 h-4 w-4" />
                                Record Payment
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Wallet className="mr-2 h-4 w-4" />
                                Create Maintenance Request
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Financial Report
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Property Viewing
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <RecentNotification />

                </div>
            </div>
            
        </div>
    )
}

export default MainDashboard