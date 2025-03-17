import { Button } from "@/components/ui/button";
import { Document, Image, Page, PDFDownloadLink, Text, View } from "@react-pdf/renderer";
import { styles } from "./style";
import formatDate from "@/lib/formatDate";
import { formatBillingMonth } from "@/lib/formatBillingMonth";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

type ReceiptDownloadProps = {
    payment: CondoPayments_Tenant,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
    buttonClassname?: string
} & PropsWithChildren

const ReceiptDownload = ({
    payment,
    children,
    buttonClassname,
    variant="ghost"
}: ReceiptDownloadProps) => {
    const totalAmount = payment.rentCost + (payment.additionalCost || 0);

    const ReceiptPDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Payment Receipt - {payment.id}</Text>
                <Text style={[styles.text, { marginBottom: 5 }]}>{payment.condo.name} - {payment.tenant.name}</Text>

                {(payment.type === "GCASH" && payment.receiptImage) && (
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                        <Image src={payment.receiptImage}
                        style={{ maxWidth: '250px', borderRadius: '6px', objectFit: 'contain', width: '100%' }} />
                    </View>
                )}

                <View style={[styles.section, { padding: 15 }]}>
                    <Text style={[styles.bold, { marginBottom: 5 }]}>Payment Breakdown</Text>
                    <View style={styles.row}>
                        <Text style={styles.text}>Rent Cost</Text>
                        <Text style={styles.text}>PHP{payment.rentCost}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Additional Cost</Text>
                        <Text style={styles.text}>PHP{payment.additionalCost || 0}</Text>
                    </View>
                    <View style={styles.separator}></View>
                    <View style={styles.row}>
                        <Text style={styles.bold}>Total Amount</Text>
                        <Text style={styles.amount}>PHP{totalAmount}</Text>
                    </View>
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    gap: 4
                }}>
                    <View style={[styles.section, { width: '100%' }]}>
                        <Text style={[styles.bold, { marginBottom: 5 }]}>Payment Details</Text>
                        <View style={styles.row}>
                            <Text style={styles.text}>Date:</Text>
                            <Text style={styles.text}>{formatDate(new Date(payment.payedAt))}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Status:</Text>
                            <Text style={styles.text}>{
                                payment.type === "GCASH" 
                                ? payment.gcashStatus
                                : payment.isPaid ? "Approved" : "Pending"
                            }</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Method:</Text>
                            <Text style={styles.text}>{payment.type}</Text>
                        </View>
                    </View>

                    <View style={[styles.section, { width: '100%' }]}>
                        <Text style={[styles.bold, { marginBottom: 5 }]}>Property & Tenant</Text>
                        <View style={styles.row}>
                            <Text style={styles.text}>Property:</Text>
                            <Text style={styles.text}>{payment.condo.name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Tenant:</Text>
                            <Text style={styles.text}>{payment.tenant.name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>Bill Month:</Text>
                            <Text style={styles.text}>{formatBillingMonth(payment.billingMonth)}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
    
    return (
        <Button variant={variant} className={cn("w-full justify-start", buttonClassname)} asChild>
            <PDFDownloadLink document={<ReceiptPDF />} fileName={`receipt-${payment.id}.pdf`}>
                {children 
                    ? children 
                    : 
                    <>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </> 
                }
            </PDFDownloadLink>
        </Button>
    )
}

export default ReceiptDownload