import { Skeleton } from "@/components/ui/skeleton"

const ConversationListSkeleton = () => {
    return (
        <div className="flex-1 overflow-y-auto">
            {Array.from({ length: 7 }).map((_, index) => {
                return (
                    <div
                    key={index}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors w-full"
                    >
                        <div className="relative shrink-0">
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <Skeleton className="w-[152px] h-5 my-0.5" />
                                <Skeleton className="w-[82px] h-4" />
                            </div>
                            <Skeleton className="w-[200px] h-[18px] my-[1px]" />
                            <Skeleton className="w-full h-[18px] my-[1px]" />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ConversationListSkeleton