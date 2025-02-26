import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import LoadingSpinner from '../common/LoadingSpinner';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    photo: z.instanceof(FileList),
    name: z.string({ required_error: 'name is required' }),
    address: z.string({ required_error: 'address is required' }),
    rentAmount: z.number({ required_error: 'rentAmount is required' }),
    isActive: z.boolean().default(false)
})

type CondoFormProps = {
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    className?: string,
}

const CondoForm = ({
    onsubmit,
    className
}: CondoFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    // reference: https://medium.com/@damien_16960/input-file-x-shadcn-x-zod-88f0472c2b81
    const photoRef = form.register('photo')

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch(error: any) {
            // handle error in here in set Error
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
                <FormField 
                control={form.control}
                name="photo"
                render={(_) => (
                    <FormItem>
                        <FormLabel>Photo</FormLabel>
                        <FormControl>
                            <Input type="file" placeholder='Enter image' {...photoRef} />
                        </FormControl>
                        <FormDescription>
                            Photo of the condo so that you can easily recognize it.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
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
                            <Textarea {...field} />
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
                            <Input type='number' placeholder='eg. for 100 is 100' {...field} />
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
                        <FormControl>
                            <Checkbox ref={field.ref} name={field.name} checked={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormDescription>
                            This is to know whether the condo is active. <br/>
                            NOTE: you will need to create an account for the tenant when you checked this.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <div>
                    <Button disabled={isLoading} type='submit'>
                        {isLoading ? <LoadingSpinner /> : "Save Condo"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CondoForm