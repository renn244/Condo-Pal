import { Card, CardContent } from "@/components/ui/card"
import formatToPesos from "@/lib/formatToPesos"
import { Building2 } from "lucide-react"
import { Link } from "react-router-dom"

type CondoLinkCardProps = {
    condo: CondoLinkCard,
    link: string
}

const CondoLinkCard = ({
    condo,
    link
}: CondoLinkCardProps) => {
    return (
        <Card>
            <Link to={`${link}/${condo.id}`}>
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-muted rounded-md p-2 mt-1">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{condo.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {condo.address}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Monthly Rent:</span> {" "}
                                    <span className="font-medium">{formatToPesos(condo.rentAmount)}</span>
                                </div>
                                <div className="text-sm">
                                    {condo.tenant ? (
                                        <span className="text-green-600 font-medium">Tenant: {condo.tenant.name}</span>
                                    ) : (
                                        <span className="text-red-500 font-medium">Vacant</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    )
}

export default CondoLinkCard