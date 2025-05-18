import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import PayoutMethodIcon from "./PayoutMethodIcon"
import { Badge } from "@/components/ui/badge"

const payoutMethods = [
    {
        id: "pm_1",
        type: "bank",
        name: "BDO Savings Account",
        details: "•••• 4567",
        isDefault: true,
    },
    {
        id: "pm_2",
        type: "gcash",
        name: "GCash",
        details: "0917 •••• 1234",
        isDefault: false,
    },
    {
        id: "pm_3",
        type: "bank",
        name: "BPI Checking Account",
        details: "•••• 7890",
        isDefault: false,
    }
]

const PayoutMethods = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payout Methods</CardTitle>
                <Button variant="outline" size="sm">
                    Manage
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {payoutMethods.map((method) => (
                    <div
                    key={method.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-muted p-2 rounded-full">
                                <PayoutMethodIcon type={method.type} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{method.name}</p>
                                <p className="text-xs text-muted-foreground">{method.details}</p>
                            </div>
                        </div>
                        {method.isDefault && (
                            <Badge variant="outline" className="text-primary border-primary">
                                Default
                            </Badge>
                        )}
                    </div>
                ))}
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button variant="ghost" className="w-full">
                    Add New Payout Method
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PayoutMethods