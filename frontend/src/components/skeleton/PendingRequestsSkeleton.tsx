import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const PendingRequestsSkeleton = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <Skeleton className="w-[256px] h-6" />
                    <Skeleton className="w-[190px] h-[18px] mt-[2px]" />
                </div>
                <Skeleton className="w-[107.77px] h-9 rounded-md" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-muted rounded-md p-2">
                                    <Skeleton className="w-5 h-5" />
                                </div>
                                <div>
                                    <Skeleton className="w-[190px] h-[18px] mb-[2px]" />
                                    <Skeleton className="w-[150px] h-4" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <Skeleton className="w-[80px] h-8" />
                                </div>
                                <Skeleton className="w-[48px] h-[22px]" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default PendingRequestsSkeleton