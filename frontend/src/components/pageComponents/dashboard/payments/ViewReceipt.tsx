import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import formatDate from "@/lib/formatDate";
import formatToPesos from "@/lib/formatToPesos";
import { CreditCard, Download, Eye, FileCheck, Smartphone, Wallet } from "lucide-react";
import { useState } from "react"
import { Link } from "react-router-dom";
import GetStatusBadge from "./GetStatusBadge";

type ViewReceiptProps = {
    payment: CondoPayments_Tenant
}

const ViewReceipt = ({
    payment
}: ViewReceiptProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const totalAmount = payment.rentCost + (payment.additionalCost || 0);

    const getPaymentMethod = (method: CondoPaymentType) => {
        switch(method) {
            case "GCASH":
                return <Smartphone className="h-4 w-4 text-blue-500" />
            case "MANUAL":
                return <Wallet className="h-4 w-4" />
            case "PAYMONGO":
                return <CreditCard className="h-4 w-4 text-green-500" />
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    <Eye className="mr-2 h-4 w-4" />
                    View Receipt
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:min-w-[567px]">
                <DialogHeader>
                    <DialogTitle>
                        Payment Receipt - {payment.id}
                    </DialogTitle>
                    <DialogDescription>
                        {payment.condo.name} - {payment.tenant.name}
                    </DialogDescription>
                </DialogHeader>

                {/* Gcash Receipt Image (If it's Gcash) */}
                <div className="space-y-4">

                </div>

                <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">
                        Payment Breakdown
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Rent Cost</span>
                            <span className="font-medium">
                                {formatToPesos(payment.rentCost)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Additional Cost</span>
                            <span className="font-medium">
                                {formatToPesos(payment.additionalCost || 0)}
                            </span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center font-medium">
                            <span>Total Amount</span>
                            <span className="text-lg text-primary">
                                {formatToPesos(totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-md">
                        <h3 className="font-medium text-sm mb-2">
                            Payment Details
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Date:
                                </span>
                                <span className="font-medium">
                                    {formatDate(new Date(payment.payedAt))}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Status:
                                </span>
                                <div>
                                    {payment.type === "GCASH" ? (
                                        <GetStatusBadge status={payment.gcashStatus || "UNKNOWN"} />
                                    ) : (
                                        <GetStatusBadge status={payment.isPaid ? "APPROVED" : "PENDING"} />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Method:
                                </span>
                                <div className="flex items-center gap-1">
                                    {getPaymentMethod(payment.type)}
                                    <span>{payment.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                        <h3 className="font-medium text-sm mb-2">
                            Propert & Tenant
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Property:</span>
                                <span className="font-medium">{payment.condo.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tenant:</span>
                                <span className="font-medium">{payment.tenant.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bill Month:</span>
                                <span className="font-medium">{payment.billingMonth}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Close
                        </Button>

                        {(payment.type === "GCASH" && payment.gcashStatus === "PENDING") && <Button asChild>
                            <Link to={`/condoPayments/gcash/verify/${payment.id}`}>
                                <FileCheck className="mr-2 h-4 w-4" />
                                Verify Payment  
                            </Link>
                        </Button>}

                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewReceipt