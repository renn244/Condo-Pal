import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axiosFetch from "@/lib/axios"
import handleValidationError, { ValidationError } from "@/lib/handleValidationError"
import { zodResolver } from "@hookform/resolvers/zod"
import { toFormData } from "axios"
import { Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
    name: z.string().min(2, { message: "First name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    profile: z.instanceof(FileList) // should be file
})

type ProfileProps = {
    initialProfile?: string,
    initialName?: string,
    initialEmail: string,
}

const Profile = ({
    initialProfile,
    initialName,
    initialEmail
}: ProfileProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialName || "",
            email: initialEmail || "",
        }
    });
    
    const photoRef = form.register('profile')

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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const formData = toFormData({
                profile: values.profile?.[0],
                name: values.name,
                email: values.email
            })

            const response = await axiosFetch.patch('/user/profile', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            if(response.status === 400) {
                throw new ValidationError(response);
            }

            if(response.status >= 401) {
                throw new Error(response.data.message);
            }

            toast.success('Profile has been updated!')

            // update the query
        } catch(error: any) {
            if(error instanceof ValidationError) {
                handleValidationError(error.response, error.response.data.errors, form.setError);
                return
            }

            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    } 

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your personal information and how others see you on the platform
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                            <div className="md:w-1/3 flex flex-col items-center space-y-4">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                                    <AvatarImage src={photoPreview || initialProfile} alt={initialName || "John Doe"} />
                                    <AvatarFallback className="text-3xl">{initialName?.charAt(0) || "A"}</AvatarFallback>
                                </Avatar>
                                <FormField 
                                control={form.control}
                                name="profile"
                                render={(_) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="file" placeholder="Enter image" {...photoRef} 
                                            onChange={(e) => {
                                                photoRef.onChange(e);
                                                handlePreviewImage(e);
                                            }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    Recommended: Square JPG, PNG, or GIF, at least 300x300 pixels
                                </p>
                            </div>
                            <div className="md:w-2/3 space-y-4">
                                <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
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
                                            <Input placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                                        Save Changes
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

export default Profile