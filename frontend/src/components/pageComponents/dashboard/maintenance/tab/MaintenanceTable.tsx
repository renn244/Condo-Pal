import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStatusBadgeVariant } from "@/lib/badgeVariant"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { MoreHorizontal, Wrench } from "lucide-react"
import MaintenanceOptions from "../../maintenance/MaintenanceOptions"
import MaintenancePagination from "../../maintenance/MaintenancePagination"
import useViewCondoParams from "@/hooks/useViewCondoParams"
import MaintenanceHeader from "../MaintenanceHeader"
import LoadingSpinner from "@/components/common/LoadingSpinner"

type MaintenanceTablProps = {
    maintenance?: MaintenanceRequest,
    isLoading: boolean,
    condoId: string,
}

const MaintenanceTable = ({
    maintenance,
    isLoading,
    condoId
}: MaintenanceTablProps) => {
    const { maintenancePage, status, priority, maintenanceSearch, setPage, setSearch, setStatus, setPriority } = useViewCondoParams();

    return (
        <Card id="maintenance-table" className="mb-6 h-[800px]">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle>Maintenance History</CardTitle>
                    <Button size="sm">
                        <Wrench className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </div>
                <CardDescription>
                    {maintenance?.maintenanceRequests.length} maintenance record{maintenance?.maintenanceRequests.length !== 1 ? "s" : ""} found
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[616px]">
                <MaintenanceHeader 
                search={maintenanceSearch} status={status} priority={priority}
                setSearch={(value) => setSearch('maintenance', value)} setStatus={setStatus} setPriority={setPriority}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Date</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="font-medium">Cost</TableHead>
                            <TableHead>Status/Priority</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                    <LoadingSpinner />
                                </TableCell>
                            </TableRow>
                        ) : (
                            maintenance && maintenance.maintenanceRequests.length > 0 ? (
                                maintenance.maintenanceRequests.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{formatDate(new Date(item.createdAt))}</TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell className="font-medium">
                                            {item.totalCost ? formatToPesos(item.totalCost) : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(item.Status as MaintenanceStatus)}>{item.Status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <MaintenanceOptions queryKey={['maintenance', 'table', maintenancePage, status, priority, maintenanceSearch, condoId]} Icon={<MoreHorizontal className="h-4 w-4" />} maintenance={item} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No maintenance records found
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="justify-center">
                {maintenance?.totalPages &&
                    <MaintenancePagination page={maintenancePage} setPage={(value) => setPage('maintenance', value)} 
                    totalPages={maintenance.totalPages} hasNext={maintenance.hasNext} />
                }
            </CardFooter>
        </Card>
    )
}

export default MaintenanceTable