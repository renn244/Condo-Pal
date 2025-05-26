import { MoreHorizontal } from "lucide-react";
import PayoutMethodIcon from "./PayoutMethodIcon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import UpdatePayoutMethod from "./UpdatePayoutMethod";
import DeletePayoutMethod from "./DeletePayoutMethod";
import { Separator } from "@/components/ui/separator";

type PayoutMethodCardProps = {
    method: payoutMethod;
}

const PayoutMethodCard = ({
    method,
}: PayoutMethodCardProps) => {
    return (
        <div
        key={method.id}
        className="flex items-center justify-between p-2 border rounded-md transition-colors"
        >
            <div className="flex items-center space-x-3">
                <div className="bg-muted p-2 rounded-full">
                    <PayoutMethodIcon type={method.methodType} />
                </div>
                <div>
                    <p className="text-sm font-medium capitalize">{method.methodType.toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">{method.mobileNumber}</p>
                </div>
            </div>
            {/* {method.isDefault && (
                <Badge variant="outline" className="text-primary border-primary">
                    Default
                </Badge>
            )} */}
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={'ghost'} size="icon">
                            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="p-1 max-w-48">
                        <UpdatePayoutMethod method={method} />
                        <Separator />
                        <DeletePayoutMethod methodId={method.id} />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default PayoutMethodCard