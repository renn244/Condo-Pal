import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft } from "lucide-react"

const ChatHeaderSkeleton = () => {
    return (
        <div className="p-2.5 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="relative flex-shrink-0">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>

                <div>
                    <Skeleton className="h-5 w-[190px] my-0.5" />
                    <Skeleton className="h-[18px] w-[420px] my-[1px]" />
                </div>
            </div>
        </div>
    )
}

export default ChatHeaderSkeleton