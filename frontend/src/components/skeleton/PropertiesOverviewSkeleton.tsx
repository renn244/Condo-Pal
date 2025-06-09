import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const PropertiesOverviewSkeleton = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <Skeleton className="w-[256px] h-6" />
                    <Skeleton className="w-[190px] h-[18px] mt-[2px]" />
                </div>
                <Skeleton className="w-[107.77px] h-[36px] rounded-md" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="w-8 h-8 rounded-md" />
                                <div>
                                    <Skeleton className="w-[150px] h-[18px] mb-[2px]" />
                                    <Skeleton className="w-[120px] h-4" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Skeleton className="w-[80px] h-6" />
                                <Skeleton className="w-[60px] h-5" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full text-sm">
                    <div className="flex items-center">
                        <Skeleton className="w-3 h-3 rounded-full mr-2" />
                        <Skeleton className="w-20 h-5" />
                    </div>
                    <div className="flex items-center">
                        <Skeleton className="w-3 h-3 rounded-full mr-2" />
                        <Skeleton className="w-[60px] h-5" />
                    </div>
                    <div className="flex items-center">
                        <Skeleton className="w-3 h-3 rounded-full mr-2" />
                        <Skeleton className="w-[49px] h-5" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default PropertiesOverviewSkeleton