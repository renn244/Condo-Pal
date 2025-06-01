import handleValidationError, { ValidationError } from "@/lib/handleValidationError";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import DateTimePicker from "../common/DateTimePicker";
import LoadingSpinner from "../common/LoadingSpinner";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

export const formSchema = z.object({
    photos: z.array(z.instanceof(File)).optional(),
    title: z.string().nonempty({
        message: 'title is required',
    }),
    description: z.string().nonempty({
        message: 'description is required'
    }).min(20, { message: 'minimum of 20' }),
    type: z.enum(['CORRECTIVE', 'PREVENTIVE', 'EMERGENCY'], { message: 'maintenance type is required' }),
    priorityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH'], { message: 'priority level is required' }),
    preferredSchedule: z.date().optional()
});

type MaintenanceFormProps = {
    onsubmit: (data: z.infer<typeof formSchema>, previousPhotos?: string[]) => Promise<void>,
    className?: string,
    isUpdate?: boolean,
    initialData?: maintenance
}

type previewFiles = {
    name: string, // unique
    url: string
}

// only for tenant
const MaintenanceForm = ({
    onsubmit,
    className,
    isUpdate=false,
    initialData
}: MaintenanceFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [previewFiles, setPreviewFiles]  = useState<previewFiles[]>(() => initialData?.photos.map(
        (photo, idx) => ({ name: `Photo ${idx + 1}`, url: photo }) // getting the previous data
    ) || [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            type: initialData?.type || 'CORRECTIVE',
            priorityLevel: initialData?.priorityLevel ||  'LOW',
            preferredSchedule: initialData?.preferredSchedule ? new Date(initialData.preferredSchedule) : undefined
        }
    })

    const buttonText = isUpdate ? "Save Changes" : "Submit Request"

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            if(!data?.photos?.length && !isUpdate) {
                form.setError('photos', {
                    type: 'min',
                    message: "At least one image is required"
                })

                return;
            }
            
            // getting all the previous files only for update
            const previousPhotos = previewFiles.flatMap((preview) => preview.url.includes('https') ? preview.url : '').filter((p) => !!p)
            await onsubmit(data, previousPhotos);
        } catch (error: any) {
            if(error instanceof ValidationError) {
                handleValidationError(error.response, error.response.data.errors, form.setError);
                return 
            }

            toast.error(error.message);
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const prevFiles = form.getValues("photos") || [];
            const newFiles = Array.from(e.target.files);
            form.setValue('photos', [...newFiles, ...prevFiles], {
                shouldValidate: true
            })
            
            // pop if previous is more than 3
            if(prevFiles.length >= 3) {
                const prevFile = previewFiles || []
                prevFile?.pop();
                setPreviewFiles(prevFile)

            }

            if(prevFiles.length) {
                handleDisplay(newFiles)
                return
            }

            // make it displayable if there is previous files no need to make it displayable again
            handleDisplay([...prevFiles, ...newFiles])
        }
    }

    const handleDisplay = (files: File[]) => {
        files?.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const fileUrl = reader.result as string
                
                setPreviewFiles(prev => 
                    prev ? [...prev, { name: file.name, url: fileUrl }] : [{ name: file.name, url: fileUrl }]
                )
            }
            reader.readAsDataURL(file)
        })
    }

    const removePhoto = (fileName: string) => {
        //removing it from the form
        const previousFiles = form.watch('photos') || [] as File[];
        form.setValue('photos', previousFiles.filter((file) => file.name !== fileName));
    
        //removing it from the previewFiles
        setPreviewFiles(prev => prev.filter((file) => file.name !== fileName))
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
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
                                        onClick={() => removePhoto(photo.name)}
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
                                        onChange={handleFileChange}
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
                <div>
                    <Button className="w-full mt-4" disabled={isLoading} type="submit">
                        {isLoading ? <LoadingSpinner /> : buttonText}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default MaintenanceForm