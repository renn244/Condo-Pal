import { MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"

const MaintenanceCardSkeleton = () => {
    return (
        <Card>
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Skeleton className="w-[72px] h-[22px]" />
                        <Skeleton className="w-[48] h-[22px]" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => undefined}>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div>
                    <Skeleton className="h-4 w-[260px] mb-1" />
                    <Skeleton className="h-[14px] w-full mb-[2px]" />
                    <Skeleton className="h-[14px] w-[200px] mb-[2px]" />
                </div>

                <div className="grid gap-3 text-sm">
                    <Skeleton className="h-5 w-[220px]" />

                    <div className="flex gap-2">
                        {Array.from({ length: 2 }).map((_) => (
                            <Skeleton className="h-16 w-16 rounded-md" />
                        ))}
                    </div>

                    <Skeleton className="h-5 w-[130px]" />
                    <Skeleton className="h-5 w-[230px]" />
                    <Skeleton className="h-5 w-[185px]" />
                </div>
            </CardContent>
        </Card>
    )
}

export default MaintenanceCardSkeleton