import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthContext } from "@/context/AuthContext"
import { Link } from "react-router-dom"

const OAuthCard = () => {
    const { user } = useAuthContext()

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                    Your account security is managed by your authentication provider
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-600 dark:text-blue-400"
                            >
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-medium text-blue-800 dark:text-blue-300">OAuth Authentication</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                You're signed in with {user?.provider}. Password management and two-factor authentication
                                are handled by your {user?.provider} account.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 pl-9">
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link to={'https://myaccount.google.com/'} target="_blank">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" x2="21" y1="14" y2="3" />
                                </svg>
                                Manage Security Settings on {user?.provider}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                    <div className="space-y-1">
                        <p className="font-medium">Connected Account</p>
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-1 rounded-full">
                                {user?.provider === "google" && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                        />
                                        <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                        />
                                        <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                        />
                                        <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm text-muted-foreground">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default OAuthCard