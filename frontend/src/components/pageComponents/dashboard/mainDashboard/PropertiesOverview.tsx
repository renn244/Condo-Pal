import PropertiesOverviewSkeleton from "@/components/skeleton/PropertiesOverviewSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import formatToPesos from "@/lib/formatToPesos"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, Home } from "lucide-react"
import { Link } from "react-router-dom"

const PropertiesOverview = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["properties", "overview"],
        queryFn: async () => {
            const response = await axiosFetch.get("/condo/getCondoOverview");

            return response.data as getCondoOverview;
        }
    })

    if(isLoading) return <PropertiesOverviewSkeleton />

    if(!data) return null

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Properties Overview</CardTitle>
                    <CardDescription>
                        Manage your {data.condoList.length} properties
                    </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard/condo">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.condoList.map((property) => (
                        <div key={property.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-muted rounded-md p-2">
                                    <Home className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{property.name}</p>
                                    <p className="text-xs text-muted-foreground">{property.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium">{formatToPesos(property.rentAmount)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {property.isActive ? "Monthly rent" : "Potential rent"}
                                    </p>
                                </div>
                                <Badge variant={property.isActive ? "success" : "outline"}>
                                    {property.isActive ? "Occupied" : "Vacant"}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full text-sm">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-muted-foreground">Occupied: {data.occupiedCount}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-muted-foreground">Vacant: {data.vacantCount}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-muted-foreground">Total: {data.totalCount}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default PropertiesOverview