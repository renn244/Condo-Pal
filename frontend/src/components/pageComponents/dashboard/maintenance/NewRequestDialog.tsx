import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosFetch from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react"
import CondoLinkCard from "../common/CondoLinkCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

/**
 * this will handle the display of the condo's available for new requests
 * @returns JSX.ELement 
 */

const NewRequestDialog = () => {
    const [open, setOpen] = useState<boolean>(false);
    
    const { 
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['getCondo'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await axiosFetch.get(`/condo/getMyCondoList?page=${pageParam}`);

            return response.data as getMyCondoList;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => lastPage.hasNext ? allPages.length + 1 : undefined,
        refetchOnWindowFocus: false,
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        New Maintenance Request
                    </DialogTitle>
                    <DialogDescription>
                        Select a condo to request maintenance
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2">
                    <ScrollArea className="max-h-[75vh] overflow-y-auto pr-2">
                        <div className="space-y-4">
                            {data?.pages.map((page) => (
                                page.getCondos?.map((condo) => (
                                    <CondoLinkCard key={condo.id} condo={condo} link="/dashboard/maintenanceRequest" />
                                )
                            )))}
                            {hasNextPage && (
                                <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                    {isFetchingNextPage ? <LoadingSpinner /> : "Load More"}
                                </Button>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default NewRequestDialog