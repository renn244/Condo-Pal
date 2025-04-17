import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import axiosFetch from "@/lib/axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
    emailNotifications: z.boolean().default(true),
    pushNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    maintenanceAlerts: z.boolean().default(true),
    paymentAlerts: z.boolean().default(true),
    leaseAlerts: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
})

const Notification = () => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            maintenanceAlerts: true,
            paymentAlerts: true,
            leaseAlerts: true,
            marketingEmails: false,
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.patch("/user/notification", data)

            if(response.status >= 400) {
                throw new Error();
            }

            toast.success("Notification preferences updated successfully")
        } catch (error) {
            toast.error("Failed to update notification preferences")
        } finally {
            setIsLoading(true)
        }
    }

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Notification Channels</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name="emailNotifications"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-base">Email Notifications</FormLabel>
                                            <FormDescription>Receive notifications via email</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="pushNotifications"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-base">Push Notifications</FormLabel>
                                            <FormDescription>Receive notifications on your device</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="smsNotifications"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-base">SMS Notifications</FormLabel>
                                            <FormDescription>Receive notifications via text message</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                                />
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Notification Types</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name="maintenanceAlerts"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-base">Maintenance Alerts</FormLabel>
                                            <FormDescription>Updates about maintenance requests</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="paymentAlerts"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-base">Payment Alerts</FormLabel>
                                            <FormDescription>Updates about rent payments and fees</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="leaseAlerts"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-base">Lease Alerts</FormLabel>
                                            <FormDescription>Updates about lease renewals and expirations</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="marketingEmails"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-base">Marketing Emails</FormLabel>
                                            <FormDescription>Receive updates about new features and promotions</FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" className="gap-2">
                                {isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Preferences
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>        
    )
}

export default Notification