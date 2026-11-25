import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="w-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 gap-y-8 md:gap-8 py-10 max-w-sm mx-auto sm:max-w-3xl lg:max-w-full">
                    <div className="col-span-full mb-10 lg:col-span-2 lg:mb-0">
                        <img src="/logo/Full_Logo.jpg" className="h-[50px] select-none pointer-events-none touch-none" />
                        <p className="py-8 text-sm text-gray-500 lg:max-w-xs text-center lg:text-left">
                            Condo management for landlords and tenants: rent, maintenance and messages in one place.
                        </p>
                    </div>

                    <div className="lg:mx-auto text-left">
                        <h4 className="text-lg text-gray-900 font-medium mb-7">
                            CondoPal
                        </h4>
                        <ul className="text-sm transition-all duration-500">
                            <li className="mb-6">
                                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                            </li>
                            <li className="mb-6">
                                <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className=" text-gray-600 hover:text-gray-900">Contact</Link>
                            </li>
                            <li>
                                <Link to="/aboutus" onClick={() => window.scrollTo(0, 0)} className=" text-gray-600 hover:text-gray-900">About us</Link>
                            </li>
                        </ul>
                    </div>
                
                    <div className="lg:mx-auto text-left ">
                        <h4 className="text-lg text-gray-900 font-medium mb-7">Services</h4>
                        <ul className="text-sm  transition-all duration-500">
                            <li className="mb-6">
                                <Link to="/pricing" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 hover:text-gray-900">Pricing</Link>
                            </li>
                            <li className="mb-6">
                                <Link to="/signup" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 hover:text-gray-900">Sign up</Link>
                            </li>
                            <li>
                                <Link to="/login" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 hover:text-gray-900">Log in</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:mx-auto text-left ">
                        <h4 className="text-lg text-gray-900 font-medium mb-7">Support</h4>
                        <ul className="text-sm  transition-all duration-500">
                            <li className="mb-6">
                                <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 hover:text-gray-900">Customer Support</Link>
                            </li>
                            <li className="mb-6">
                                <Link to="/terms&conditions" onClick={() => window.scrollTo(0, 0)} className=" text-gray-600 hover:text-gray-900">Terms & Conditions</Link>
                            </li>
                            <li >
                                <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)}   className=" text-gray-600 hover:text-gray-900">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                </div>
                
                <div className="py-7 border-t border-gray-200">
                    <div className="flex items-center justify-center flex-col lg:justify-between lg:flex-row">
                        <span className="text-sm text-gray-500">© {new Date().getFullYear()} CondoPal. All rights reserved.</span>
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer