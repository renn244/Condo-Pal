import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    message: z.string().min(20, {
        message: "Message must be at least 20 characters long",
    }),
})

const ContactUs = () => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.post("/contact", data)

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            toast.success("Message sent successfully")
            form.reset()            
        } catch (error) {
            toast.error("An error occurred. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="py-6">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="lg:mb-0 mb-10">
                        <div className="group w-full h-full">
                            <div className="relative h-full">
                            <div className="w-full h-full min-h-[300px] lg:rounded-l-2xl lg:rounded-r-none rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900" />
                            <h1 className="font-manrope text-white text-4xl font-bold leading-10 absolute top-11 left-11">Contact us</h1>
                            <p className="absolute bottom-11 left-11 right-11 text-white text-lg">
                                Send us a message and we'll reply by email.
                            </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-5 lg:p-8 lg:rounded-r-2xl lg:rounded-l-none rounded-2xl space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <h2 className="text-primary font-manrope text-4xl font-semibold leading-10 mb-11">Send Us A Message</h2>
                                <FormField 
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" className="w-full" placeholder="Name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField 
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" className="w-full" placeholder="Email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField 
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className="w-full min-h-[250px] max-h-[330px]" placeholder="Message" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button className="w-full">
                                    {isLoading ? <LoadingSpinner /> : "Send"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ContactUs