import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useViewCondoParams from "@/hooks/useViewCondoParams"
import { getPriorityBadgeVariant } from "@/lib/badgeVariant"
import { Eye, Wrench } from "lucide-react"
import { memo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const chartConfig = {
    Pending: {
        label: "Pending",
        color: "#f59e0b",
    },
    InProgress: {
        label: "In Progress",
        color: "#8b5cf6",
    },
    Completed: {
        label: "Completed",
        color: "#10b981",
        
    },
    Canceled: {
        label: "Canceled",
        color: "#ef4444",
    },
} satisfies ChartConfig

type MaintenanceStatsProps = {
    maintenanceStats: any | undefined | null
}

const MaintenanceStatusChart = ({
    maintenanceStats,
}: MaintenanceStatsProps) => {
    const { setSearch } = useViewCondoParams();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Maintenance Status</CardTitle>
                <CardDescription>
                    Distribution of maintenance requests by status
                </CardDescription>
            </CardHeader>
            <CardContent className="h-auto">
                {maintenanceStats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center justify-center">
                            <ResponsiveContainer>
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <PieChart>
                                        <Pie
                                        data={maintenanceStats.statusStatistics}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        // Explicitly enable animation and set duration
                                        isAnimationActive={true}
                                        animationBegin={0}
                                        animationDuration={700}
                                        animationEasing="ease"
                                        >
                                            {maintenanceStats?.statusStatistics.map((entry: any, index: number) => (
                                                entry.value > 0 ? (
                                                    <Cell key={`cell-${index}`} name={entry.name} fill={(chartConfig as any)[entry.name]?.color} />
                                                ) : null
                                            )
                                            )}
                                        </Pie>
                                        <ChartTooltip
                                        content={<ChartTooltipContent hideLabel />}
                                        />
                                        <ChartLegend
                                        content={<ChartLegendContent  />} 
                                        />
                                    </PieChart>
                                </ChartContainer>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-md">
                                <div className="bg-muted p-3 rounded-md">
                                    <div className="text-sm font-medium">Total Requests</div>
                                    <div className="text-2xl font-bold">{maintenanceStats.totalRequest}</div>
                                </div>
                                <div className="bg-muted p-3 rounded-md">
                                    <div className="text-sm font-medium">Pending Attention</div>
                                    <div className="text-2xl font-bold">
                                        {maintenanceStats.statusStatistics?.[0].value || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-3">
                                <h3 className="text-lg text-[#f59e0b] font-semibold">Pending Maintenance</h3>
                                <p className="text-sm text-muted-foreground">Requests requiring attention</p>
                            </div>
                            {maintenanceStats.pendingMaintenances.length > 0 ? (
                                <div className="border rounded-md overflow-y-auto max-h-[334px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Priority</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {maintenanceStats.pendingMaintenances.map((item: any) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.title}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getPriorityBadgeVariant(item.priorityLevel)}>
                                                            {item.priorityLevel}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                    <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                    onClick={() => {
                                                        setSearch('maintenance', item.title)
                                                        // scroll to the table
                                                        const table = document.getElementById('maintenance-table')
                                                        if (table) {
                                                            table.scrollIntoView({ behavior: 'smooth' })
                                                        }
                                                    }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Look
                                                    </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full max-h-[334px] bg-muted rounded-md">
                                    <div className="text-center text-muted-foreground">
                                        <Wrench className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                        <p>No pending maintenance requests</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        No maintenance data available for chart visualization
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default memo(MaintenanceStatusChart)