import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const RecentNotificationSkeleton = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="w-[223px] h-6" />
            </CardHeader>
            <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="px-4 py-3 border-b last:border-b-0">
                        <div className="flex gap-3">
                            <div className="mt-1">
                                <Skeleton className="h-5 w-5 rounded-md" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="w-[130px] h-5" />
                                    <Skeleton className="w-[86px] h-4" />
                                </div>
                                <div className="mt-1">
                                    <Skeleton className="w-[200px] h-5 mt-1" />
                                    <Skeleton className="w-[150px] h-5 mt-[1px]" />
                                </div>
                                <div className="mt-2">
                                    <Skeleton className="w-[93px] h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="border-t pb-2 flex-row justify-center pt-1">
                <Skeleton className="w-[150px] h-4 mx-2 my-4" />
            </CardFooter>
        </Card>
    )
}

export default RecentNotificationSkeleton