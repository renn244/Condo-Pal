import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import formatToPesos from "@/lib/formatToPesos"

type PaymentInstructionsProps = {
    gcashNumber: string;
    ownerName: string;
    totalCost: number;
    condoId: string;
}

const PaymentInstructions = ({
    gcashNumber, ownerName, 
    totalCost, condoId,
}: PaymentInstructionsProps) => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm text-muted-foreground">Gcash Number</Label>
                        {/* landlord gcash number */}
                        <p className="font-medium">{gcashNumber}</p>
                    </div>
                    <div>
                        {/* This is for the landlord */}
                        <Label className="text-sm text-muted-foreground">Owner Name</Label>
                        <p className="font-medium">{ownerName}</p> 
                    </div>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Open your Gcash app and log-in</li>
                    <li>Tap on "Send Money" and select "Send to Gcash Account"</li>
                    <li>Enter Gcash number shown above</li>
                    <li>Enter the exact amount: {formatToPesos(totalCost)}</li>
                    <li>Include your condo ID ({condoId}) in the message</li>
                    <li>Complete the payment and take a screenshot of the receipt</li>
                    <li>Upload the screenshot below</li>
                </ol>
            </CardContent>
        </Card>
    )
}

export default PaymentInstructions