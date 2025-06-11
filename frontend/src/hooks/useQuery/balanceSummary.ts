import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const balanceSummaryQuery = () => {
    return useQuery({
        queryKey: ['balanceSummary'],
        queryFn: async () => {
            const response = await axiosFetch.get('/payout/balance-summary');

            return response.data as getBalanceSummary;
        }
    })
}

export default balanceSummaryQuery;