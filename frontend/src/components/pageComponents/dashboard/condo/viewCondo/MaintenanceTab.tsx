import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { getStatusBadgeVariant } from "@/lib/badgeVariant"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { Clock, Eye, MoreHorizontal, Pencil, Wrench, XCircle } from "lucide-react"

type MainteananceTabProps = {
    condo: any
}

const MaintenanceTab = ({
    condo
}: MainteananceTabProps) => {
    return (
        <TabsContent value="maintenance" className="space-y-6">
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle>Maintenance History</CardTitle>
                        <Button size="sm">
                            <Wrench className="mr-2 h-4 w-4" />
                            New Request
                        </Button>
                    </div>
                    <CardDescription>
                        {condo.maintenance.length} maintenance record{condo.maintenance.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Date</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right font-medium">Cost</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {condo.maintenance.length > 0 ? (
                                condo.maintenance.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{formatDate(new Date(item.date))}</TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell className="text-right font-medium">{formatToPesos(item.cost)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(item.status as MaintenanceStatus)}>{item.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="end" className="w-56 p-1">
                                                    <Button variant="ghost" className="w-full justify-start">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Details
                                                    </Button>
                                                    <Button variant="ghost" className="w-full justify-start">
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        Update Status
                                                    </Button>
                                                    <Button variant="ghost" className="w-full justify-start">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit Maintenance
                                                    </Button>
                                                    <Separator className="my-1" />
                                                    <Button 
                                                    variant="ghost" 
                                                    className="w-full justify-start text-destructive focus:text-destructive hover:text-destructive">
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Cancel maintenance
                                                    </Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No maintenance records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Maintenance Cost Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Maintenance Costs</CardTitle>
                    <CardDescription>
                        Breakdown of maintenance expenses by category
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Maintenance cost chart visualization would go here
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}

export default MaintenanceTab