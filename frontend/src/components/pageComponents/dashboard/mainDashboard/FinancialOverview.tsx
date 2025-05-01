import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axiosFetch from "@/lib/axios"
import formatToPesos from "@/lib/formatToPesos"
import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-1))",
    },
    expenses: {
        label: "Expenses",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const FinancialOverview = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["financials", "overview"],
        queryFn: async () => {
            const response = await axiosFetch.get("/condo-payment/condoPaymentsTenant");

            return response.data as CondoPaymentsTenant;
        }
    })

    if(isLoading) return <LoadingSpinner />

    if(!data) return null
    
    const netIncome = data.totalRevenue - data.totalExpenses;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Financial Overview</CardTitle>
                    <CardDescription>Monthly revenue and expenses</CardDescription>
                </div>
                <Select defaultValue="monthly">
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Monthly" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <BarChart data={data.financialStatistics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="billingMonth" />
                                <YAxis />
                                <ChartTooltip 
                                cursor={false}
                                content={
                                    <ChartTooltipContent 
                                    labelFormatter={(label: any) => `BillingMonth: ${label}`}
                                    indicator="dot"
                                    />
                                }
                                />
                                <Bar dataKey="revenue" name="Revenue" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full text-sm">
                    <div>
                        <span className="text-muted-foreground">Total Revenue:</span>
                        <span className="font-medium ml-1">{formatToPesos(data.totalRevenue)}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Total Expenses:</span>
                        <span className="font-medium ml-1">{formatToPesos(data.totalExpenses)}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Net Income:</span>
                        <span className="font-medium ml-1">{formatToPesos(netIncome)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default FinancialOverview