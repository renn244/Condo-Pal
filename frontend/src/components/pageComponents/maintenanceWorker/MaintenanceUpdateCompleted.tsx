import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MaintenanceStatus } from "@/constant/maintenance.constants"
import axiosFetch from "@/lib/axios"
import formatDate from "@/lib/formatDate"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toFormData } from "axios"
import { Camera, Upload, X } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

type MaintenanceUpdateCompletedProps ={
    maintenanceRequest: MaintenanceGetRequest
}

const MaintenanceUpdateCompleted = ({
    maintenanceRequest
}: MaintenanceUpdateCompletedProps) => {
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [proofPreviews, setProofPreviews] = useState<string[]>([]);
    
    const [proofFiles, setProofFiles] = useState<File[]>([]);
    const [message, setMessage] = useState<string>("");
    const [totalCost, setTotalcost] = useState<number | undefined>();

    const proofFileInputRef = useRef<HTMLInputElement>(null)

    const { mutate: updateCompleted, isPending: isPendingCompleted } = useMutation({
        mutationKey: ['maintenanceRequest', 'completed', maintenanceRequest.id],
        mutationFn: async () => {
            if (!totalCost || proofFiles.length === 0) {
                throw new Error("Please fill in all fields and upload proof files.");
            }

            const formData = toFormData({ totalCost, message })
            proofFiles.forEach((file) => { formData.append("proof", file) });

            const response = await axiosFetch.patch(
                `/maintenance/completed?maintenanceId=${maintenanceRequest.id}`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )
        
            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data;
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: async (data) => {
            // update the queryt here
            await queryClient.setQueryData(['maintenanceRequest', maintenanceRequest.id], (oldData: MaintenanceGetRequest) => {
                return {
                    ...oldData,
                    Status: data.Status,
                    totalCost: data.totalCost,
                    proofOfCompletion: data.proofOfCompletion,
                    completionDate: data.completionDate,
                }
            })
        }
    });

    const handleProofFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setProofFiles([...proofFiles, ...newFiles])

            newFiles.forEach((file) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setProofPreviews((prev) => [...prev, reader.result as string])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    // Remove proof file
    const removeProofFile = (index: number) => {
        setProofFiles(proofFiles.filter((_, i) => i !== index))
        setProofPreviews(proofPreviews.filter((_, i) => i !== index))
    }

    return (
        <CardContent>
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    {maintenanceRequest.type.replace("_", " ")} •
                    {maintenanceRequest.scheduledDate && ` Scheduled: ${formatDate(new Date(maintenanceRequest.scheduledDate))} •`}
                    {" "} Created: {formatDate(new Date(maintenanceRequest.createdAt))}
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild> 
                        <Button>
                            Mark as Completed
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Mark Maintenance as Completed
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="totalCost" className="text-sm font-medium">
                                Total Cost
                            </Label>
                            <Input
                            id="totalCost"
                            type="number"
                            placeholder="Total Cost"
                            value={totalCost}
                            onChange={(e) => setTotalcost(e.target.valueAsNumber)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm font-medium">
                                Message
                            </Label>
                            <Textarea 
                            id="message"
                            placeholder="Input your message regarding the maintenance completion"
                            className="max-h-[120px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Completion Proof</h3>
                            <div className="border-2 border-dashed rounded-md p-6 text-center">
                                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm mb-2">Upload photos as proof of completion</p>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="mx-auto"
                                    onClick={() => proofFileInputRef.current?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Photos
                                </Button>
                                <Input
                                type="file"
                                ref={proofFileInputRef}
                                className="hidden"
                                onChange={handleProofFileSelect}
                                multiple
                                accept="image/*"
                                />
                            </div>

                            {proofPreviews.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {proofPreviews.map((preview, index) => (
                                    <div key={index} className="relative h-20 w-20">
                                        <img
                                        src={preview || "/placeholder.svg"}
                                        alt={`Proof preview ${index + 1}`}
                                        className="h-20 w-20 object-cover rounded-md border"
                                        />
                                        <button
                                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center"
                                        onClick={() => removeProofFile(index)}
                                        >
                                        <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button
                        onClick={() => updateCompleted()}
                        disabled={
                            proofFiles.length === 0 || 
                            totalCost === undefined ||
                            maintenanceRequest.Status !== MaintenanceStatus.IN_PROGRESS ||
                            isPendingCompleted
                        }
                        >
                            {isPendingCompleted ? <LoadingSpinner /> :  "Complete"}
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
            
        </CardContent>
    )
}

export default MaintenanceUpdateCompleted