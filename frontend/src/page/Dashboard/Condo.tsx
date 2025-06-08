import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import CondoCard from "@/components/pageComponents/dashboard/condo/CondoCard"
import CondoPagination from "@/components/pageComponents/dashboard/condo/CondoPagination"
import CreateCondo from "@/components/pageComponents/dashboard/condo/CreateCondo"
import CondoCardSkeleton from "@/components/skeleton/CondoCardSkeleton"
import useCondoParams from "@/hooks/useCondoParams"
import axiosFetch from "@/lib/axios"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export type CondoResponse = {
    getCondos: CondoCard[]
    hasNext: boolean
    totalPages: number
}

const Condo = () => {
    const { page, setPage, search } = useCondoParams();

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:grid-rows-3 lg:grid-rows-2 gap-6 md:min-h-[828px]">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_) => (
                        <CondoCardSkeleton />
                    ))
                ) : (
                    condos?.getCondos && condos.getCondos.length > 0 ? (
                        condos.getCondos.map((condo) => (
                            <CondoCard key={condo.id} condo={condo} />
                        ))
                    ) : null
                )}
                {/* null for now but maybe create a component for this later on */}
            </div>

            <CondoPagination page={page} setPage={setPage} totalPages={condos?.totalPages || 1} hasNext={condos?.hasNext || false} />
        </div>
    )
}

export default Condo