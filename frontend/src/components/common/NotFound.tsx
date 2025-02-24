import { ChevronLeft, HomeIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"

const NotFound = () => {

    return (
        <div className="h-[849px] w-full bg-white flex flex-col items-center justify-center">
            <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
                {/* 404 */}
                <div className="relative">
                    <h1 className="text-8xl md:text-9xl font-bold text-blue-600 animate-pulse">404</h1>
                    <div className="absolute -bottom-2 w-full h-2 bg-gradient-to-r from-transparent via-blue-600 to-transparent blur-sm" />
                </div>

                {/* Error Message */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
                <p className="text-gray-500 max-w-lg mt-2">
                    Sorry, we couldn't find the page you're looking for. The page might have been removed or the link might be
                    broken.
                </p>

                {/* <div className="flex w-full max-w-sm items-center space-x-2 mt-6">
                    <Input type="text" placeholder="Search for content..." />
                    <Button type="submit" size={"icon"} className="bg-blue-600 hover:bg-blue-700">
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                    </Button>
                </div> */}

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button variant="outline" className="gap-2" onClick={() => window.history.back()}>
                        <ChevronLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                    <Button className="gap-2 flex-row bg-blue-600 hover:bg-blue-700" asChild>
                        <Link to="/">
                            <HomeIcon className="h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </div>

                {/* Helpful Links */}
                {/* <div className="mt-8 border-t border-gray-200 pt-8">
                    <p className="text-sm text-gray-500">
                        Looking for something specific?
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-4 text-sm text-blue-600 underline-offset-2">
                        <Link to={'/help'} className="hover:underline">
                            Help Center
                        </Link>
                        <Link to={'/contact'} className="hover:underline">
                            Contact Support
                        </Link>
                        <Link to={'/sitemap'} className="hover:underline">
                            Sitemap
                        </Link>
                    </div>
                </div> */}
            </div>

        </div>
    )
}

export default NotFound