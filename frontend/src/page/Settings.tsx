import LoadingSpinner from "@/components/common/LoadingSpinner"
import NotFound from "@/components/common/NotFound"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import Billing from "@/components/pageComponents/settings/Billing/Billing"
import Notification from "@/components/pageComponents/settings/Notification"
import Profile from "@/components/pageComponents/settings/Profile"
import Security from "@/components/pageComponents/settings/Security"
import Sidebars from "@/components/pageComponents/settings/Sidebars"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react"
import { Link, Route, Routes } from "react-router-dom"

const Settings = () => {
    const { data: initialData, isLoading, error, refetch } = useQuery({
        queryKey: ["user", "initial-data"],
        queryFn: async () => {
            const response = await axiosFetch.get("/user/initial-data");

            if(response.status === 404) {
                return null;
            }

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data;
        }
    })

    if(isLoading) return <LoadingSpinner />

    if(error) return <SomethingWentWrong reset={refetch} />

    if(!initialData) return <NotFound />

    return (
        <div className="min-h-scren bg-gray-50/50 dark:bg-gray-900/50 pb-10">
            {/* Header */}
            <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-8 md:px-12 lg:px-10">
                <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="container mx-auto px-3 py-6 max-w-7xl">
                <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Settings</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Sidebars />

                    {/* Main Content */}
                    <div className="space-y-6 col-span-2">
                        <Routes>
                            <Route path="profile" element={
                                <Profile 
                                initialName={initialData.name}
                                initialProfile={initialData.profile}
                                initialEmail={initialData.email}
                                />
                            } />
                            <Route path="security" element={
                                <Security />
                            } />
                            <Route path="notifications" element={
                                <Notification />
                            } />
                            <Route path="property" element={
                                undefined
                            } />
                            <Route path="billing" element={
                                <Billing />
                            } />
                        </Routes>
                    </div>
                </div>
            </div>            
        </div>
    )
}

export default Settings