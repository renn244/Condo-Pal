import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import TenantRecentNotificationSkeleton from "./TenantRecentNotificationSkeleton"

const TenantDashboardSkeleton = () => {
    return (
        <div className="container mx-auto mt-3">
            {/* Header */}
            <div className="flex flex-col md:flex justify-between items-start md:items-start mb-2 gap-4">
                <div>
                    <Skeleton className="w-[260px] h-6" />
                </div>
            </div>

            <div className="flex flex-col gap-2 w-ful">
                <div className="grid grid-cols-4 mb-2 w-full p-[3px] rounded-lg bg-muted">
                    <div className="w-full px-2 py-1 flex items-center justify-center h-[29px] bg-white rounded-md">
                        <Skeleton className="w-[100px] h-4" />
                    </div>
                    <div className="w-full px-2 py-1 flex items-center justify-center h-[29px]">
                        <Skeleton className="w-[105px] h-4" />
                    </div>
                    <div className="w-full px-2 py-1 flex items-center justify-center h-[29px]">
                        <Skeleton className="w-[140px] h-4" />
                    </div>
                    <div className="w-full px-2 py-1 flex items-center justify-center h-[29px]">
                        <Skeleton className="w-[105px] h-4" />
                    </div>
                </div>

                <div className="w-full flex-1 outline-none space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-6 w-[175px]" />
                                    <Skeleton className="h-[18px] w-[188px] mt-[2px]" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Skeleton className="h-[18px] w-[110px] mt-[2px] mb-1" />
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-9 w-9 rounded-full" />
                                            <Skeleton className="h-5 w-[129px] my-[2px]" />
                                        </div>
                                    </div>
                                    <div className="max-w-[603px]">
                                        <Skeleton className="h-5 w-[80px] mb-1" />
                                        <Skeleton className="h-6 w-[350px] lg:w-[490px]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Skeleton className="h-5 w-[100px] mb-1" />
                                            <Skeleton className="h-6 w-[135px]" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-5 w-[120px] mb-1" />
                                            <Skeleton className="h-6 w-[145px]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-muted p-4 rounded-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <Skeleton className="h-6 w-[105px]" />
                                            <Skeleton className="h-6 w-[80px]" />
                                        </div>
                                        <Skeleton className="h-7 my-[2px] w-[150px] mb-2" />
                                        <div className="flex justify-between items-center mt-2">
                                            <Skeleton className="h-5 w-[60px]" />
                                            <Skeleton className="h-6 w-[100px]" />
                                        </div>
                                        <div className="mt-2">
                                            <Skeleton className="h-[18px] mt-[2px] w-[200px]" />
                                            <Skeleton className="h-2 w-full rounded-full mt-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <TenantRecentNotificationSkeleton />
                </div>
            </div>
        </div>
    )
}

export default TenantDashboardSkeleton