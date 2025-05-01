import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatBillingMonth } from "@/lib/formatBillingMonth"
import formatToPesos from "@/lib/formatToPesos"
import { Home } from "lucide-react"

type CondoHeaderProps = {
    condo: ViewCondoInformation
} 

const CondoHeader = ({
    condo
}: CondoHeaderProps) => {

    return (
        <div className="grid gird-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
                <Card className="overflow-hidden">
                    <div className="relative h-48 md:h-64">
                        <img src={condo.photo} alt={condo.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3">
                            <Badge variant={condo.isActive ? "success" : "outline"}>
                                {condo.isActive ? "Occupied" : "Vacant"}
                            </Badge>
                        </div>
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">{condo.name}</CardTitle>
                        <CardDescription>{condo.address}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-10 w-10 border border-border">
                                    <AvatarImage src={condo.owner.profile} alt={condo.owner.name} />
                                    <AvatarFallback>{condo.owner.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs text-muted-foreground">Owner</p>
                                    <p className="font-medium">{condo.owner.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {condo.tenant ? (
                                    <>
                                        <Avatar className="h-10 w-10 border border-border">
                                            <AvatarImage src={condo.tenant.profile} alt={condo.tenant.name} />
                                            <AvatarFallback>{condo.tenant.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Tenant</p>
                                            <p className="font-medium">{condo.tenant.name}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center bg-muted">
                                            <Home className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs">Tenant</p>
                                            <p className="text-sm">No Tenant</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                            Latest Bill Information - {formatBillingMonth(condo.latestBill.billingMonth)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Monthly Rent</p>
                            <p className="text-2xl font-bold text-primary">{formatToPesos(condo.latestBill.rentCost)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Additional Fee</p>
                                <p className="font-medium">{formatToPesos(condo.latestBill.additionalCost)}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-end gap-2">
                            <p className="text-sm text-muted-foreground">Total Monthly</p>
                            <p className="text-xl font-bold">
                                {formatToPesos(condo.latestBill.totalCost)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default CondoHeader