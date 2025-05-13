import LoadingSpinner from "@/components/common/LoadingSpinner";
import SomethingWentWrong from "@/components/common/SomethingWentWrong";
import ExpenseTab from "@/components/pageComponents/tenantDashboard/tabs/ExpenseTab";
import MaintenanceTab from "@/components/pageComponents/tenantDashboard/tabs/MaintenanceTab";
import OverviewTab from "@/components/pageComponents/tenantDashboard/tabs/OverviewTab";
import PaymentsTab from "@/components/pageComponents/tenantDashboard/tabs/PaymentsTab";
import TenantNotice from "@/components/pageComponents/tenantDashboard/TenantNotice";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/AuthContext"
import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const TenantDashboard = () => {
    const { user } = useAuthContext();
    if(!user) return null // this is already checked by the TenantRoute

    const { data: paymentSummary, isLoading, refetch, error } = useQuery({
        queryKey: ["paymentSummary"],
        queryFn: async () => {
            const response = await axiosFetch.get(`/condo-payment/getBill?condoId=${user!.condo?.id}`)

            if(response.status === 404) {
                return null;
            }

            if(response.status >= 400) {
                throw new Error("Error fetching payment summary");
            }

            return response.data as CondoBillInformation;
        },
        refetchOnWindowFocus: false,
    })

    if(isLoading) return <LoadingSpinner />

    if(error) return <SomethingWentWrong reset={refetch} />

    // if no payment summary is found, it means the user is not a tenant anymore of any condo that is from condoPal
    if(!paymentSummary) return <TenantNotice />;

    return (
        <div className="container mx-auto mt-3">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div>
                    <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-4 mb-2 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <OverviewTab paymentSummary={paymentSummary} />

                {/* Payments Tab */}
                <PaymentsTab paymentSummary={paymentSummary} />

                {/* Maintenance Tab */}
                <MaintenanceTab />

                <ExpenseTab />
            </Tabs>
        </div>
    )
}

export default TenantDashboard