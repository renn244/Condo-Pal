import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const TenantRecentNotificationSkeleton = () => {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-[250px]" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div 
                        key={index} 
                        className="p-4 rounded-md border"
                        >
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <Skeleton className="h-5 w-5 rounded-lg" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <Skeleton className="h-6 w-[185px]" />
                                        <Skeleton className="h-4 w-[50px]" />
                                    </div>
                                    <Skeleton className="h-5 md:w-[450px] lg:w-[650px] mt-1" />
                                    <div className="mt-2">
                                        <Skeleton className="h-[34px] w-[138px]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="w-full h-10" />
            </CardFooter>
        </Card>
    )
}

export default TenantRecentNotificationSkeleton