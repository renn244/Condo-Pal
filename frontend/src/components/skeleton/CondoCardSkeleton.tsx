import { MoreVertical } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const CondoCardSkeleton = () => {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex h-full flex-col">
                <div className="relative h-58">
                    <Skeleton className="w-full h-full object-fill rounded-b-none" />
                    <Skeleton className="absolute top-3 right-3 rounded-full" />
                    <div className="absolute top-3 left-3">
                        <Button variant="secondary" size="icon" className="h-8 w-8 bg-white">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <CardContent className="p-5 flex-1 flex-col">
                    <div className="mb-4">
                        <Skeleton className="h-[28px] w-[360px] mb-1" />
                        <Skeleton className="h-[20px] w-[230px]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full border border-border" />
                            <div>
                                <Skeleton className="h-[14px] w-[40px] mb-[2px] rounded-sm" />
                                <Skeleton className="h-[20px] w-[130px]" />
                            </div>
                        </div>

                        <div>
                            <Skeleton className="h-[14px] w-[80px] mb-[2px] rounded-sm" />
                            <Skeleton className="h-[28px] w-[105px]" />
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}

export default CondoCardSkeleton