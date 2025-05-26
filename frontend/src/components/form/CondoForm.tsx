import handleValidationError, { ValidationError } from '@/lib/handleValidationError';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import LoadingSpinner from '../common/LoadingSpinner';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export const formSchema = z.object({
    photo: z.instanceof(FileList),
    name: z.string({ required_error: 'name is required' }).nonempty("name is required"),
    address: z.string({ required_error: 'address is required' }).nonempty("address is required"),
    rentAmount: z.number({ required_error: 'rentAmount is required' }),
    isActive: z.boolean().default(false)
})

type CondoFormProps = {
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    className?: string,
    initialData?: condo,
    isUpdate?: boolean,
}

const CondoForm = ({
    onsubmit,
    className,
    initialData,
    isUpdate=false
}: CondoFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [photoPreview, setPhotoPreview] = useState<string>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || '',
            address: initialData?.address || '',
            rentAmount: initialData?.rentAmount || undefined,
            isActive: initialData?.isActive || true,
        }
    })

    // photoRef reference: https://medium.com/@damien_16960/input-file-x-shadcn-x-zod-88f0472c2b81
    const photoRef = form.register('photo')
    const buttonText = isUpdate ? "Save Changes" : "Create Condo";

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            if(!data.photo.length && !isUpdate) {
                form.setError('photo', {
                    type: 'required',
                    message: 'photo is required',
                })
                return
            }

            await onsubmit(data);
        } catch(error: any) {
            if(error instanceof ValidationError) {
                handleValidationError(error.response, error.response.data.errors, form.setError);
                return
            }

            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
                <div className='flex gap-4'>
                    <div className='w-full max-w-[360px] space-y-3'>
                        <img className='max-h-[250px] w-full rounded-lg' src={photoPreview || initialData?.photo || 'https://www.nwpc.com/wp-content/uploads/2022/05/placeholder-image-gray-3x2-1.png'} />  
                        <FormField 
                        control={form.control}
                        name="photo"
                        render={(_) => (
                            <FormItem>
                                <FormLabel>Photo</FormLabel>
                                <FormControl>
                                    <Input type="file" placeholder='Enter image' {...photoRef} onChange={(e) => {
                                        photoRef.onChange(e);
                                        handlePreviewImage(e);
                                    }} />
                                </FormControl>
                                <FormDescription>
                                    Photo of the condo so that you can easily recognize it.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className='space-y-2'>
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    Name of the condo for easy recoginition.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Textarea className='max-h-[225px] max-w-[424px] aria-invalid:ring-ring/50 dark:aria-invalid:ring-ring/40 aria-invalid:border-ring' {...field} />
                                </FormControl>
                                <FormDescription>
                                    Address of the condo. just in case you want to know quickly if you forgot.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="rentAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rent Amount</FormLabel>
                                <FormControl>
                                    <Input type='number' placeholder='eg. for 100 is 100' {...field} 
                                    onChange={(e) => field.onChange(+e.target.value)} />
                                </FormControl>
                                <FormDescription>
                                    This is the amount per month that the tenant will pay.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Is Active</FormLabel>
                                <FormControl className='flex-row items-center'>
                                    <Checkbox className='mb-0 size-4 ml-1' 
                                    ref={field.ref} name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormDescription>
                                    This is to know whether the condo is occupied (isActive)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </div>
                <div>
                    <Button className='w-full mt-4' disabled={isLoading} type='submit'>
                        {isLoading ? <LoadingSpinner /> : buttonText}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CondoForm