import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"

type ExpensePaginationProps = {
    totalPages: number,
    hasNext: boolean,
    page: number,
    setPage: (value: number) => void,
}

const ExpensePagination = ({
    totalPages,
    hasNext,
    page, 
    setPage
}: ExpensePaginationProps) => {
    const availablePages = Array.from({ length: 5 }, (_, i) => page - 2 + i).filter((n) => n > 0 && (totalPages || 1) >= n)
    
    return (
        <div className="mt-8 justify-center">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        {page > 1 && (
                            <PaginationItem onClick={() => setPage(page - 1)} className="cursor-pointer">
                                Previous
                            </PaginationItem>
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
                            <PaginationItem onClick={() => setPage(page + 1)} className="cursor-pointer">
                                Next
                            </PaginationItem>
                        )}
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default ExpensePagination