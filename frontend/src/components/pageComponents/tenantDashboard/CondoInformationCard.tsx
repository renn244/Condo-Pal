import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatBillingMonth } from "@/lib/formatBillingMonth"
import formatToPesos from "@/lib/formatToPesos"
import { Calendar, Receipt } from "lucide-react"

type CondoInformationCardProps = {
    condo: CondoBillInformation
}

const CondoInformationCard = ({
    condo
}: CondoInformationCardProps) => {
    return (
        <Card className="mb-6">
            <CardHeader className="pb-2">
                <CardTitle>{condo.name}</CardTitle>
                <CardDescription>{condo.address}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <img src={condo.photo || "/placeholder.svg"}
                    alt={condo.name}
                    className="w-full h-48 object-cover rounded-md" />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>Payment for: {formatBillingMonth(condo.billingMonth)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Receipt className="h-4 w-4" />
                    <span>Tenant: {condo?.tenant?.name}</span>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Montly Rent</span>
                        <span>{formatToPesos(condo.rentCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Additional Cost:</span>
                        <span>{formatToPesos(condo.additionalCost)}</span>
                    </div>
                    <div className="px-2 border-l-[3px]">
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Expenses Cost:</span>
                            <span className="text-sm">{formatToPesos(condo.expensesCost)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Maintenance Cost:</span>
                            <span className="text-sm">{formatToPesos(condo.maintenanceCost)}</span>
                        </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center font-medium">
                        <span>Total Amount</span>
                        <span className="text-lg text-primary">
                            {formatToPesos(condo.totalCost)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CondoInformationCard