import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const FinancialOverviewSkeleton = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <Skeleton className="w-[209px] h-6" />
                    <Skeleton className="w-[209px] h-[18px] mt-[2px]" />
                </div>
                <Skeleton className="w-[120px] h-9 rounded-md" />
            </CardHeader>
            <CardContent>
                <div className="md:min-h-[300px]">
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full text-sm">
                    <div className="flex items-center">
                        <Skeleton className="w-[97px] h-[17px]" />
                        <Skeleton className="w-[80px] h-[17px] ml-1" />
                    </div>
                    <div className="flex items-center">
                        <Skeleton className="w-[104px] h-[17px]" />
                        <Skeleton className="w-[70px] h-[17px] ml-1" />
                    </div>
                    <div className="flex items-center">
                        <Skeleton className="w-[80px] h-[17px]" />
                        <Skeleton className="w-[82px] h-[17px] ml-1" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default FinancialOverviewSkeleton