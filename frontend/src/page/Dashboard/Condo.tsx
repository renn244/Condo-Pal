import LoadingSpinner from "@/components/common/LoadingSpinner"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import CondoCard from "@/components/pageComponents/dashboard/condo/CondoCard"
import CreateCondo from "@/components/pageComponents/dashboard/condo/CreateCondo"
import useCondoParams from "@/hooks/useCondoParams"
import axiosFetch from "@/lib/axios"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export type CondoResponse = {
    getCondos: CondoCard[]
    hasNext: boolean
}

const Condo = () => {
    const { page, search } = useCondoParams();

    const { data: condos, isLoading, isError, refetch } = useQuery({
        queryKey: ['condos', page, search],
        queryFn: async () => {
            const response = await axiosFetch.get(`/condo/getMyCondos?page=${page || 1}&search=${search}`)

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data as CondoResponse // for now
        },
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData
    })

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isError) {
        return <SomethingWentWrong reset={refetch} />
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary">
                    Condo Management
                </h1>
                <CreateCondo />
            </div>
            <div className="">
                {/* for searching */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {condos?.getCondos && condos.getCondos.length > 0 ? (
                    condos.getCondos.map((condo) => (
                        <CondoCard key={condo.id} condo={condo} />
                    ))
                ) : null}
                {/* null for now but maybe create a component for this later on */}
            </div>
        </div>
    )
}

export default Condo