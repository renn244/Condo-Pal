import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axios"
import { toFormData } from "axios"
import { Upload, X } from "lucide-react"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import toast from "react-hot-toast"

type PaymentReceiptProps = {
    condoId: string,
    rentCost: number,
    additionalCost: number,
    totalPaid: number,
    setIsSuccess: Dispatch<SetStateAction<boolean>>,
}

const PaymentReceipt = ({
    condoId,
    rentCost,
    additionalCost,
    totalPaid,
    setIsSuccess,
}: PaymentReceiptProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [previewFile, setPreviewFile] = useState<string | null>(null)
    const [notes, setNotes] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const onSubmit = async () => {
        setIsSubmitting(true)
        try {
            const formData = toFormData({
                gcashPhoto: file,
                notes: notes,
                rentCost: rentCost,
                additionalCost: additionalCost,
                totalPaid: totalPaid
            })

            const response = await axiosFetch.post(`/condo-payment/createPayment/Gcash?condoId=${condoId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            // success // redirect // setSuccess true
            setIsSuccess(true)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    // file functions
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            setFile(selectedFile)

            const reader = new FileReader();
            reader.onload = () => {
                setPreviewFile(reader.result as string)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const clearFile = () => {
        setFile(null);
        setPreviewFile(null);
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Upload Payment Receipt</CardTitle>
                <CardDescription>Please upload a screenshot of you Gcash payment receipt</CardDescription>
            </CardHeader>
            <CardContent>
                {previewFile ? (
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                            <img
                                src={previewFile || "/placeholder.svg"}
                                alt="Receipt preview"
                                className="max-h-[300px] mx-auto rounded-md border"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                type="button"
                                onClick={clearFile}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-md p-6 text-center mb-4">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <Label htmlFor="receipt" className="block mb-2 cursor-pointer">
                            <span className="text-primary font-medium">Click to upload</span>
                        </Label>
                        <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 5MB)</p>
                        <Input id="receipt" type="file" accept="image/*" className="hidden" 
                        onChange={handleFileChange} 
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea className="min-h-[150px] max-h-[300px]"
                    id="notes"
                    placeholder="Add any additional about you payment..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="button" onClick={() => onSubmit()} 
                disabled={isSubmitting || !file}
                >
                    {isSubmitting ? <LoadingSpinner /> : "Submit Payment"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PaymentReceipt