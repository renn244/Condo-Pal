import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const Billing = () => {


    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-primary/5 border rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                    Current Plan
                                </Badge>
                                <h3 className="text-xl font-bold">Professional Plan</h3>
                                <p className="text-muted-foreground">$49.99/month • Renews on August 15, 2023</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline">Change Plan</Button>
                                <Button variant="outline" className="text-destructive hover:text-destructive">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-background rounded-lg border">
                                <p className="text-sm font-medium">Properties</p>
                                <p className="text-2xl font-bold mt-1">25 / 50</p>
                                <p className="text-xs text-muted-foreground mt-1">50% used</p>
                            </div>
                            <div className="p-4 bg-background rounded-lg border">
                                <p className="text-sm font-medium">Storage</p>
                                <p className="text-2xl font-bold mt-1">5GB / 20GB</p>
                                <p className="text-xs text-muted-foreground mt-1">25% used</p>
                            </div>
                            <div className="p-4 bg-background rounded-lg border">
                                <p className="text-sm font-medium">Team Members</p>
                                <p className="text-2xl font-bold mt-1">3 / 10</p>
                                <p className="text-xs text-muted-foreground mt-1">30% used</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View and download your past invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="bg-muted/50 p-3 text-sm font-medium grid grid-cols-12">
                            <div className="col-span-5">Invoice</div>
                            <div className="col-span-3">Date</div>
                            <div className="col-span-2">Amount</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                        <div className="divide-y">
                            {[
                                { id: "INV-001", date: "July 15, 2023", amount: "$49.99" },
                                { id: "INV-002", date: "June 15, 2023", amount: "$49.99" },
                                { id: "INV-003", date: "May 15, 2023", amount: "$49.99" },
                            ].map((invoice) => (
                                <div key={invoice.id} className="p-3 text-sm grid grid-cols-12 items-center">
                                    <div className="col-span-5 font-medium">Professional Plan - {invoice.id}</div>
                                    <div className="col-span-3 text-muted-foreground">{invoice.date}</div>
                                    <div className="col-span-2">{invoice.amount}</div>
                                    <div className="col-span-2 text-right">
                                        <Button variant="ghost" size="sm">
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mr-2 h-4 w-4"
                                            >
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" x2="12" y1="15" y2="3" />
                                            </svg>
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default Billing