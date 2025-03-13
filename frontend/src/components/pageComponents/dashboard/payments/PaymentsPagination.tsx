import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import usePaymentsParams from "@/hooks/usePaymentsParams"

type PaymentsPaginationProps = {
    totalPages: number,
    hasNext: boolean
}

const PaymentsPagination = ({
    totalPages,
    hasNext
}: PaymentsPaginationProps) => {
    const { page, setPage } = usePaymentsParams();
    const availablePages = Array.from({ length: 5 }, (_, i) => page - 2 + i).filter((n) => n > 0 && (totalPages || 1) >= n)

    return (
        <div className="flex justify-center mb-6">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        {page > 1 && (
                            <PaginationPrevious onClick={() => setPage(page - 1)} className="cursor-pointer" />
                        )}
                    </PaginationItem>

                    {availablePages.map((currpage) => (
                        <PaginationItem key={currpage}>
                            <PaginationLink className="cursor-pointer" isActive={currpage === page} 
                            onClick={() => setPage(currpage)}>
                                {currpage}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        {hasNext && (
                            <PaginationNext onClick={() => setPage(page + 1)} className="cursor-pointer" />
                        )}
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default PaymentsPagination