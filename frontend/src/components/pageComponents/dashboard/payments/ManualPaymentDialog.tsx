import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import axiosFetch from "@/lib/axios";
import formatToPesos from "@/lib/formatToPesos";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Building2, DollarSign } from "lucide-react";
import { useState } from "react"
import { Link } from "react-router-dom";

/**
 * this will handle the dispaly of the condo's avaible for manual payments
 * @returns JSX 
 */

const ManualPaymentDialog = () => {
    const [open, setOpen] = useState<boolean>(false);

    const { 
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['getCondo'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await axiosFetch.get(`/condo/getMyCondoForManualPayment?page=${pageParam}`);

            return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => lastPage.hasNext ? allPages.length + 1 : undefined,
        refetchOnWindowFocus: false,
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Add Manual Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        Record Manual Payment
                    </DialogTitle>
                    <DialogDescription>
                        Select a condo to record a manual payment
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-2">
                    <ScrollArea className="max-h-[75vh] overflow-y-auto pr-2">
                        <div className="space-y-4">
                            {data?.pages.map(page => (
                                page.getCondos?.map((condo: any) => (
                                    <CondoLinkCard key={condo.id} condo={condo} />
                                ))
                            ))}
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

type CondoLinkCardProps = {
    condo: any
}

const CondoLinkCard = ({
    condo
}: CondoLinkCardProps) => {
    return (
            <Card>
                <Link to={`/condoPayments/manual/${condo.id}`}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-muted rounded-md p-2 mt-1">
                                <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{condo.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {condo.address}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Monthly Rent:</span> {" "}
                                        <span className="font-medium">{formatToPesos(condo.rentAmount)}</span>
                                    </div>
                                    <div className="text-sm">
                                        {condo.tenant ? (
                                            <span className="text-green-600 font-medium">Tenant: {condo.tenant.name}</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Vacant</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Link>
            </Card>
    )
}

export default ManualPaymentDialog