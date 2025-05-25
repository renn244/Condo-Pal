import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const FAQ = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium">When will I receive my payout?</p>
                    <p className="text-xs text-muted-foreground">
                        Payouts are typically processed within 1-3 business days, depending on your bank's processing time.
                    </p>
                </div>
                <Separator />
                <div className="space-y-2">
                    <p className="text-sm font-medium">Are there any fees for payouts?</p>
                    <p className="text-xs text-muted-foreground">
                        CondoPal does not charge fees for standard payouts. However, your bank may apply their own transfer
                        fees.
                    </p>
                </div>
                <Separator />
                <div className="space-y-2">
                    <p className="text-sm font-medium">Why is some of my balance pending?</p>
                    <p className="text-xs text-muted-foreground">
                        Pending balances represent recent payments that are still being processed and will be available for
                        withdrawal soon.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default FAQ