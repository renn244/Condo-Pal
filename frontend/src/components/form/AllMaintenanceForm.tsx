import { z } from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import handleValidationError, { ValidationError } from "@/lib/handleValidationError"
import toast from "react-hot-toast"
import { Button } from "../ui/button"
import { Plus, X } from "lucide-react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import DateTimePicker from "../common/DateTimePicker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { MaintenanceStatus, PaymentResponsibility } from "@/constant/maintenance.constants"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Separator } from "../ui/separator"
import formatToPesos from "@/lib/formatToPesos"
import LoadingSpinner from "../common/LoadingSpinner"

export const formSchema = z.object({
    photos: z.array(z.instanceof(File)).optional(),
    title: z.string().nonempty({ message: 'title is required' }),
    description: z.string().nonempty({ message: 'description is required' }).min(20, { message: 'description is required' }),
    type: z.enum(['CORRECTIVE', 'PREVENTIVE', 'EMERGENCY'], { message: 'maintenance type is required' }),
    priorityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH'], { message: 'priority level is required' }),
    Status: z.enum(['PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'], { message: 'status is required'}),
    
    estimatedCost: z.number().optional(),
    totalCost: z.number().optional(),

    paymentResponsibility: z.enum(['TENANT', 'LANDLORD']).optional(),

    preferredSchedule: z.date().optional(),
    scheduledDate: z.date().optional(),
    completionDate: z.date().optional(),
    proofOfCompletion: z.array(z.instanceof(File)).optional(),
}).superRefine(({ Status, totalCost, scheduledDate, paymentResponsibility }, ctx) => {
    if(Status === 'COMPLETED' && !totalCost) {
        ctx.addIssue({
            code: 'custom',
            message: 'Total cost is required when status is Completed',
            path: ['totalCost'],
        })
    }

    if(totalCost && !paymentResponsibility) {
        ctx.addIssue({
            code: 'custom',
            message: 'Payment responsibility is required when total cost is set',
            path: ['paymentResponsibility'],
        })
    }

    if(Status === 'SCHEDULED' && !scheduledDate) {
        ctx.addIssue({
            code: 'custom',
            message: 'Scheduled date is required when status is Scheduled',
            path: ['scheduledDate']
        })
    }

})

type previewFiles = {
    name: string, // unique
    url: string
}

type AllMaintenanceFormProps = {
    initialData?: maintenance,
    onsubmit: (data: z.infer<typeof formSchema>, previousPhotos?: string[], previousProofPhotos?: string[]) => Promise<void>
}

const AllMaintenanceForm = ({
    initialData,
    onsubmit
}: AllMaintenanceFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    const [previewFiles, setPreviewFiles]  = useState<previewFiles[]>(() => initialData?.photos.map(
        (photo, idx) => ({ name: `Photo ${idx + 1}`, url: photo }) // getting the previous data
    ) || [])
    const [proofPreviewFiles, setProofPreviewFiles] = useState<previewFiles[]>(() => initialData?.proofOfCompletion.map(
        (photo, idx) => ({ name: `Photo ${idx + 1}`, url: photo }) // getting the previous data
    ) || [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            type: initialData?.type || 'CORRECTIVE',
            priorityLevel: initialData?.priorityLevel || 'LOW',
            Status: initialData?.Status || 'PENDING',
            estimatedCost: initialData?.estimatedCost || undefined,
            totalCost: initialData?.totalCost || undefined,
            paymentResponsibility: initialData?.paymentResponsibility || undefined,
            preferredSchedule: initialData?.preferredSchedule ? new Date(initialData.preferredSchedule) : undefined,
            scheduledDate: initialData?.scheduledDate ? new Date(initialData.scheduledDate) : undefined,
            completionDate: initialData?.completionDate ? new Date(initialData?.completionDate) : undefined,
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const previousPhotos = previewFiles.flatMap((preview) => preview.url.includes('https') ? preview.url : '').filter((p) => !!p);
            const previousProofPhotos = proofPreviewFiles.flatMap((preview) => preview.url.includes('https') ? preview.url : '').filter((p) => !!p);

            await onsubmit(data, previousPhotos, previousProofPhotos);
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleValidationError(error.response, error.response.data.errors, form.setError);
                return;
            }

            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    // make this usable for photos and proof of completion
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'photos' | 'proofOfCompletion') => {
        if(e.target.files) {
            const prevFiles = form.getValues(type) || [];
            const newFiles = Array.from(e.target.files);
            form.setValue(type, [...newFiles, ...prevFiles], {
                shouldValidate: true
            })
            
            // pop if previous is more than 3
            if(prevFiles.length >= 3) {
                const prevFile = previewFiles || []
                prevFile?.pop();

                if(type === 'photos') {
                    setPreviewFiles(prevFile)
                } else {
                    setProofPreviewFiles(prevFile)
                }
            }

            if(prevFiles.length) {
                handleDisplay(newFiles, type)
                return
            }

            // make it displayable if there is previous files no need to make it displayable again
            handleDisplay([...prevFiles, ...newFiles], type)
        }
    }

    const handleDisplay = (files: File[], type: 'photos' | 'proofOfCompletion') => {
        files?.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const fileUrl = reader.result as string
                
                if(type === 'photos') {
                    setPreviewFiles(prev => 
                        prev ? [...prev, { name: file.name, url: fileUrl }] : [{ name: file.name, url: fileUrl }]
                    )
                } else {
                    setProofPreviewFiles(prev => 
                        prev ? [...prev, { name: file.name, url: fileUrl }] : [{ name: file.name, url: fileUrl }]
                    )
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const removePhoto = (fileName: string, type: 'photos' | 'proofOfCompletion') => {
        //removing it from the form
        const previousFiles = form.watch('photos') || [] as File[];
        form.setValue(type, previousFiles.filter((file) => file.name !== fileName));
    
        //removing it from the previewFiles
        if(type === 'photos') {
            setPreviewFiles(prev => prev.filter((file) => file.name !== fileName));
        } else {
            setProofPreviewFiles(prev => prev.filter((file) => file.name !== fileName));
        }
    }

    const currentStatus = form.watch("Status");
    const paymentResponsibility = form.watch("paymentResponsibility");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="details">Request Details</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling Status</TabsTrigger>
                <TabsTrigger value="financial">Financial Details</TabsTrigger>
            </TabsList>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <TabsContent value="details" className="space-y-6">
                        <FormField 
                        control={form.control}
                        name="photos"
                        render={() => (
                            <FormItem>
                                <FormLabel>Photos</FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {previewFiles?.map((photo) => (
                                            <div key={photo.name} className="relative group">
                                                <div className="aspect-square rounded-lg overflow-hidden border bg-muted/20">
                                                    <img src={photo.url || "/placeholder.svg"} alt={photo.name} className="object-cover w-full h-full" />
                                                </div>
                                                <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removePhoto(photo.name, 'photos')}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <p className="text-xs mt-1 truncate text-muted-foreground">{photo.name}</p>
                                            </div>
                                        ))}
                                        {previewFiles.length < 3 && (
                                            <div className="aspect-square rounded-lg border border-dashed flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer relative">
                                                <Input
                                                id="photos"
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer h-full"
                                                onChange={(e) => handleFileChange(e, 'photos')}
                                                />
                                                <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">Add Photo</p>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Maximum of 3 photo's
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g: Aircon Issue turning on" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea className='max-h-[225px] w-full aria-invalid:ring-ring/50 dark:aria-invalid:ring-ring/40 aria-invalid:border-ring' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="grid sm:grid-cols-2">
                            <FormField 
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Maintenance Type</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-[280px]">
                                                <SelectValue placeholder="Select a Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Maintenance Type</SelectLabel>
                                                    <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                                                    <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                                                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField 
                            control={form.control}
                            name="priorityLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority Level</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-[280px]">
                                                <SelectValue placeholder="Select Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Priority Level</SelectLabel>
                                                    <SelectItem value="LOW">Low</SelectItem>
                                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                                    <SelectItem value="HIGH">High</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="scheduling" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="Status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={MaintenanceStatus.PENDING}>Pending</SelectItem>
                                            <SelectItem value={MaintenanceStatus.SCHEDULED}>Scheduled</SelectItem>
                                            <SelectItem value={MaintenanceStatus.IN_PROGRESS}>In Progress</SelectItem>
                                            <SelectItem value={MaintenanceStatus.COMPLETED}>Completed</SelectItem>
                                            <SelectItem value={MaintenanceStatus.CANCELED}>Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField 
                            control={form.control}
                            name="preferredSchedule"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Preferred Schedule (Optional)</FormLabel>
                                    <FormControl>
                                        <DateTimePicker form={form} field="preferredSchedule" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="scheduledDate"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Scheduled Date</FormLabel>
                                    <FormControl>
                                        <DateTimePicker form={form} field="scheduledDate" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="completionDate"
                            render={() => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Completion Date</FormLabel>
                                    <FormControl>
                                        <DateTimePicker form={form} field="completionDate" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>

                        {/* Proof of Completion Here! */}
                        {currentStatus === MaintenanceStatus.COMPLETED && (
                            <FormField 
                            control={form.control}
                            name="proofOfCompletion"
                            render={() => (
                                <FormItem>
                                    <FormLabel>proofOfCompletion</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {proofPreviewFiles?.map((photo) => (
                                                <div key={photo.name} className="relative group">
                                                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted/20">
                                                        <img src={photo.url || "/placeholder.svg"} alt={photo.name} className="object-cover w-full h-full" />
                                                    </div>
                                                    <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removePhoto(photo.name, 'proofOfCompletion')}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                    <p className="text-xs mt-1 truncate text-muted-foreground">{photo.name}</p>
                                                </div>
                                            ))}
                                            {proofPreviewFiles.length < 3 && (
                                                <div className="aspect-square rounded-lg border border-dashed flex flex-col items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer relative">
                                                    <Input
                                                    id="proofOfCompletion"
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer h-full"
                                                    onChange={(e) => handleFileChange(e, 'proofOfCompletion')}
                                                    />
                                                    <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">Add Photo</p>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Maximum of 3 photo's
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="financial" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="estimatedCost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimated Cost (PHP)</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? null : Number(e.target.value)
                                            field.onChange(value)
                                        }}
                                        value={field.value === null ? "" : field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="totalCost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Cost (PHP)</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="number"
                                        placeholder="0"
                                        disabled={currentStatus !== MaintenanceStatus.COMPLETED}
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? null : Number(e.target.value)
                                            field.onChange(value)
                                        }}
                                        value={field.value === null ? "" : field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {currentStatus === MaintenanceStatus.COMPLETED && field.value === null && (
                                        <FormDescription className="text-red-500">Required when status is Completed</FormDescription>
                                    )}
                                </FormItem>
                            )}
                            />

                            <div className="md:col-span-2">
                                <FormField
                                control={form.control}
                                name="paymentResponsibility"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Payment Responsibility</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || undefined}
                                            className="flex space-x-4"
                                            >
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl>
                                                        <RadioGroupItem value={PaymentResponsibility.LANDLORD} />
                                                    </FormControl>
                                                    <FormLabel className="cursor-pointer">Landlord</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl>
                                                        <RadioGroupItem value={PaymentResponsibility.TENANT} />
                                                    </FormControl>
                                                    <FormLabel className="cursor-pointer">Tenant</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-md">
                            <h3 className="font-medium text-blue-800 mb-2">Payment Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-blue-700">Estimated Cost:</span>
                                    <span className="text-sm font-medium">
                                        {form.watch("estimatedCost") ? formatToPesos(form.watch("estimatedCost") || 0) : "Not set"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-blue-700">Total Cost:</span>
                                    <span className="text-sm font-medium">
                                        {form.watch("totalCost") ? formatToPesos(form.watch("totalCost") || 0) : "Not set"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-blue-700">Responsibility:</span>
                                    <span className="text-sm font-medium">
                                        {paymentResponsibility
                                            ? paymentResponsibility.charAt(0) + paymentResponsibility.slice(1).toLowerCase()
                                            : "Not set"}
                                    </span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-blue-700">Status:</span>
                                    <span className="text-sm font-medium">
                                        {form.watch("Status") === MaintenanceStatus.COMPLETED ? "Finalized" : "Pending Completion"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <div className="mt-6 flex justify-end">
                        <Button type="button" variant="outline"
                        className="mr-2" onClick={() => window.history.back()}>
                            Cancel
                        </Button> 
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <LoadingSpinner /> : "Submit"}
                        </Button>  
                    </div>
                </form>
            </Form>
        </Tabs>
    )
}

export default AllMaintenanceForm