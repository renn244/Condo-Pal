import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const payoutMethodsQuery = () => {
    return useQuery({
        queryKey: ['payout', 'methods'],
        queryFn: async () => {
            const response = await axiosFetch.get('/payout-method');

            if( response.status >= 400) {
                toast.error('Something went wrong while fetching payout methods!');
            }

            return response.data as payoutMethods;
        }
    })
}

export default payoutMethodsQuery;