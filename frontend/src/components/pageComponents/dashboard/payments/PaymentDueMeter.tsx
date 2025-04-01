import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type PaymentDueMeterProps = {
    dueDate: string,
    className?: string
} & ComponentProps<"div">;

const PaymentDueMeter = ({
    dueDate,
    className,
    ...props
}: PaymentDueMeterProps) => {
    const PaymentDate = new Date(dueDate);
    const today = new Date();
    // Set the hours, minutes, seconds, and milliseconds to 0 for both dates
    PaymentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    // this handle even the month of payment (1000 * 60 * 60 * 24) = 1 day
    const daysUntilNextPayment = Math.floor((PaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isLate = daysUntilNextPayment < 0;

    return (
        <div className={cn("mt-2", className)} {...props} >
            <div className={`text-sm text-muted-foreground ${isLate && "text-red-500 font-medium"}`}>
                {Math.abs(daysUntilNextPayment)} {" "}
                {!isLate ? "Days until payment is due" : "Days late"}
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div
                    className={`h-2 bg-primary rounded-full ${isLate ? "bg-red-500" : ""}`}
                    style={{ width: `${Math.min(100, (30 - daysUntilNextPayment) * 3.33)}%` }}
                ></div>
            </div>
        </div>
    )
}

export default PaymentDueMeter