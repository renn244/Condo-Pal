import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import formatDate from "@/lib/formatDate"
import formatToPesos from "@/lib/formatToPesos"
import { DollarSign, Download, FileText, MoreHorizontal } from "lucide-react"

type ExpensesTabProps = {
    condo: any
}

const ExpensesTab = ({
    condo
}: ExpensesTabProps) => {
    return (
        <TabsContent value="expenses" className="space-y-6">
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle>Expense Records</CardTitle>
                        <Button size="sm">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Add Expense
                        </Button>
                    </div>
                    <CardDescription>
                        {condo.expenses.length} expense record{condo.expenses.length !== 1 ? "s": ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Recurring</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {condo.expenses.length > 0 ? (
                                condo.expenses.map((expense: any) => (
                                    <TableRow key={expense.id}>
                                        <TableCell className="font-medium">{formatDate(new Date(expense.date))}</TableCell>
                                        <TableCell>{expense.category}</TableCell>
                                        <TableCell>{expense.description}</TableCell>
                                        <TableCell className="text-right font-medium">{formatToPesos(expense.amount)}</TableCell>
                                        <TableCell>
                                            {expense.recurring ? (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                                    Recurring
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                                                    One-time
                                                </Badge>
                                            )}
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
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Button>
                                                    <Button variant="ghost" className="w-full justify-start">
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download Receipt
                                                    </Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No expense records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Expense Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>Distribution of expense by category</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Expense breakdown chart visualization would go here
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}

export default ExpensesTab