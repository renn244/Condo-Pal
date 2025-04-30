import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Recurrence } from "@/constant/expense.contants"
import { formatBillingMonth } from "@/lib/formatBillingMonth"
import formatDateTime from "@/lib/formatDateTime"
import formatToPesos from "@/lib/formatToPesos"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, FileText, RefreshCcw } from "lucide-react"

type ViewExpenseProps = {
    expense: expense,
    icon?: React.ReactNode,
    buttonVariant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
    className?: string,
}

const ViewExpense = ({
    expense,
    icon,
    className,
    buttonVariant="ghost"
}: ViewExpenseProps) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} className={cn("w-full justify-start", className)}>
                    {icon ? (
                        icon
                    ) : (
                        <>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{expense.title}</DialogTitle>
                    <DialogDescription>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="capitalize">
                                {expense.category}
                            </Badge>
                            <Badge variant={expense.isPaid ? "default" : "destructive"}>
                                {expense.isPaid ? "Paid" : "Unpaid"}
                            </Badge>
                            {expense.recurring && (
                                <Badge variant="outline" className="capitalize">
                                    {expense.recurrence?.toLocaleLowerCase()}
                                </Badge>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Amount</h3>
                            <div className="text-2xl font-bold">{formatToPesos(expense.cost)}</div>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                            {expense.notes && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Notes</h4>
                                    <p className="text-sm bg-muted p-3 rounded-md">{expense.notes}</p>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Billing Month</h4>
                                    <p className="text-sm">{expense.billingMonth ? formatBillingMonth(expense.billingMonth) : "N/A"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Payment Status</h4>
                                    <p className="text-sm flex items-center gap-1">
                                        {expense.isPaid ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-green-500" /> Paid
                                            </>
                                            ) : (
                                            <>
                                                <Clock className="h-4 w-4 text-amber-500" /> Unpaid
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Created</h4>
                                    <p className="text-sm">{formatDateTime(new Date(expense.createdAt))}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Last Updated</h4>
                                    <p className="text-sm">{formatDateTime(new Date(expense.updatedAt))}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Expense ID</h4>
                                    <p className="font-mono text-xs md:text-sm ">{expense.id}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Property ID</h4>
                                    <p className="font-mono text-xs md:text-sm ">{expense.condoId}</p>
                                </div>
                            </div>
                        </div>

                        {expense.recurring && expense.recurrence && (
                            <>
                                <Separator className="my-4" />
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Recurrence Details</h4>
                                    <div className="bg-muted p-3 rounded-md">
                                        <div className="flex items-center gap-2">
                                            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                            This expense recurs{" "}
                                            <span className="font-medium">
                                                {expense.recurrence.charAt(0).toUpperCase() +
                                                expense.recurrence.slice(1)}
                                            </span>
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {expense.recurrence === Recurrence.MONTHLY && "Charged each month"}
                                            {expense.recurrence === Recurrence.QUARTERLY && "Charged every three months"}
                                            {expense.recurrence === Recurrence.YEARLY && "Charged once per year"}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewExpense