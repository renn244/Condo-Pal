import LoadingSpinner from "@/components/common/LoadingSpinner";
import NotFound from "@/components/common/NotFound";
import SomethingWentWrong from "@/components/common/SomethingWentWrong";
import CondoHeader from "@/components/pageComponents/dashboard/condo/viewCondo/CondoHeader";
import ExpensesTab from "@/components/pageComponents/dashboard/condo/viewCondo/ExpensesTab";
import MaintenanceTab from "@/components/pageComponents/dashboard/condo/viewCondo/MaintenanceTab";
import PaymentsTab from "@/components/pageComponents/dashboard/condo/viewCondo/PaymentsTab";
import SummaryCards from "@/components/pageComponents/dashboard/condo/viewCondo/SummaryCards";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";


const ViewCondo = () => {
  const { condoId } = useParams<{ condoId: string }>();

  const { data:condo, isLoading, error, refetch } = useQuery({
    queryKey: ['viewCondo', 'condoIdPLaceholder'],
    queryFn: async () => {
      const response = await axiosFetch.get(`/condo/getViewCondo?condoId=${condoId}`)

      if(response.status === 404) {
        return null
      }

      if(response.status >= 400) {
        throw new Error(response.data.message)
      }
      
      return response.data as ViewCondoInformation
    }
  })

  if(isLoading) {
    return <LoadingSpinner />
  }

  if(error) {
    return <SomethingWentWrong reset={refetch} />
  }

  if(!condo || !condoId) {
    return <NotFound />
  }

  return (
    <div className="py-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
        <Link to="/dashboard/condo" className="hover:text-foreground">
            Condos
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{condo.name}</span>
      </div>

      <CondoHeader condo={condo} />

      {/* Summary Cards */}
      <SummaryCards 
      totalMaintenanceCost={condo.condoSummary.totalMaintenanceCost}
      totalExpenses={condo.condoSummary.totalExpenses}
      totalIncome={condo.condoSummary.totalIncome}
      totalPaymentCount={condo.condoSummary.totalPaymentCount}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        {/* Payments Tab */}
        <PaymentsTab condoId={condoId} />

        {/* Maintenance Tab */}
        <MaintenanceTab condo={condo} />

        {/* Expenses Tab */}
        <ExpensesTab condo={condo} />
      </Tabs>
    </div>
  )
}

export default ViewCondo