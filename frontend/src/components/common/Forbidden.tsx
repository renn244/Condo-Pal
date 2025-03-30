import { ChevronLeft, HomeIcon, RefreshCcw, ShieldAlert } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"

type ForbiddenProps = {
    message?: string
}

const Forbidden = ({
    message = "This area might be restricted or require additionalauthorization."
}: ForbiddenProps) => {

    return (
        <div className="h-[849px] w-full bg-white flex flex-col items-center justify-center">
            <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                    <div className="relative flex items-center justify-center">
                        <ShieldAlert className="h-24 w-24 text-blue-600 animate-pulse" />
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping" />
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8">Access Forbidden (403)</h1>
                <p className="text-gray-500 max-w-lg mt-2">
                    Sorry, you don't have permission to access this page. <br />
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button variant="outline" className="gap-2" onClick={() => window.history.back()}>
                        <ChevronLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => window.location.reload()}>
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Button variant="outline" className="gap-2" asChild>
                        <Link to="/">
                            <HomeIcon className="h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </div>

                {/* Support Section */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                    <p className="text-sm text-gray-500">Need immediate assistance?</p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-4 text-sm text-blue-600 underline-offset-2">
                        <Link to="/help" className="hover:underline">
                            Help Center
                        </Link>
                        <Link to="/status" className="hover:underline">
                            System Status
                        </Link>
                        <Link to="/contact" className="hover:underline">
                            Contact Support
                        </Link>
                    </div>
                </div>

                <div className="text-xs text-gray-400 mt-8">
                    If you believe you should have access to this page, please contact support with the following details:
                    <br />
                    Time: {new Date().toISOString()}
                    <br />
                </div>
            </div>
        </div>
    )
}

export default Forbidden