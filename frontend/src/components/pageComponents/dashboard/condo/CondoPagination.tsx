import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

type CondoPaginationProps = {
    totalPages: number,
    hasNext: boolean,
    page: number,
    setPage: (value: number) => void,
}

const CondoPagination = ({
    totalPages,
    hasNext,
    page, 
    setPage
}: CondoPaginationProps) => {
    const availablePages = Array.from({ length: 5 }, (_, i) => i - 2 + 1).filter((n) => n > 0 && (totalPages || 1) >= n)

    return (
        <div className="mt-8 justify-center">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        {page > 1 && (
                            <PaginationPrevious onClick={() => setPage(page - 1)} className="cursor-pointer" />
                        )}
                    </PaginationItem>
                    {availablePages.map((currpage) => (
                        <PaginationItem key={currpage}>
                            <PaginationLink className="cursor-pointer" isActive={currpage === page} onClick={() => setPage(currpage)}>
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

export default CondoPagination