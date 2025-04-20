import {
    Shield,
    User,
    Building,
    FileText,
    MessageSquare,
    BarChart,
    Share2,
    Lock,
    UserCog,
    Bell,
    Mail,
    Phone,
} from "lucide-react"

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-blue-50/30">
            <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-6xl">
                <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
                    <div className="bg-blue-100 p-4 sm:p-6 rounded-full mb-4 sm:mb-6">
                        <Shield className="h-10 w-10 sm:h-14 sm:w-14 text-primary" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">Privacy Policy</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Last updated: April 20, 2025</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6 md:p-8">
                    <p className="text-sm sm:text-base text-foreground mb-6">
                        CondoPal ("we", "our", or "us") respects your privacy and is committed to protecting the personal
                        information you share with us. This policy outlines how we collect, use, store, and protect your data.
                    </p>

                    <div className="space-y-3 sm:space-y-6">
                        <section>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground">1. Information We Collect</h2>
                            </div>
                            <p className="text-sm sm:text-base text-foreground mb-4">
                                We collect personal information to provide our rental management services. This includes:
                            </p>

                            <div className="pl-3 sm:pl-4 border-l-2 border-blue-100 mt-4 sm:mt-6 mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary/80 flex-shrink-0" />
                                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">From Landlords:</h3>
                                </div>
                                <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                                    <li>Full name, contact number, email address</li>
                                    <li>Property and unit details</li>
                                    <li>Payment information (e.g. PayMongo details, GCash account names)</li>
                                    <li>Uploaded files (e.g. contracts, receipts)</li>
                                </ul>
                            </div>

                            <div className="pl-3 sm:pl-4 border-l-2 border-blue-100 mt-4 sm:mt-6 mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary/80 flex-shrink-0" />
                                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">From Tenants:</h3>
                                </div>
                                <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                                    <li>Full name, contact number, email address</li>
                                    <li>Proof of payment (e.g. GCash screenshots)</li>
                                    <li>Maintenance request details</li>
                                    <li>Chat messages between tenant and landlord</li>
                                </ul>
                            </div>

                            <div className="pl-3 sm:pl-4 border-l-2 border-blue-100 mt-4 sm:mt-6 mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary/80 flex-shrink-0" />
                                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">System-Generated Data:</h3>
                                </div>
                                <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                                    <li>Payment history</li>
                                    <li>Notifications sent/received</li>
                                    <li>IP address and browser/device information</li>
                                    <li>Chat activity (timestamps, message status like seen/sent)</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
                            </div>
                            <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">We use your information to:</p>
                            <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                                <li>Facilitate rent collection and record payments</li>
                                <li>Send reminders via email or SMS</li>
                                <li>Provide real-time maintenance and communication tools</li>
                                <li>Track income and expenses for accounting</li>
                                <li>Provide support and resolve disputes</li>
                                <li>Improve app performance and reliability</li>
                            </ul>

                            <div className="pl-3 sm:pl-4 border-l-2 border-blue-100 mt-4 sm:mt-6 mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary/80 flex-shrink-0" />
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground">Legal Use of Messages:</h3>
                                </div>
                                <p className="text-sm sm:text-base text-foreground mb-4 pl-4 sm:pl-6">
                                Chat messages exchanged between landlords and tenants may be stored and, when necessary, used as
                                supporting evidence in legal matters or disputes. This is particularly relevant when users avail of
                                our legal support services, such as tenant eviction or proof of agreement. We treat this data with
                                confidentiality and only share it with authorized legal representatives or authorities when required.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground">3. Sharing Your Data</h2>
                            </div>
                            <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">
                                We do not sell your data. We only share data:
                            </p>
                            <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                                <li>
                                    With third-party services used for messaging (e.g., Twilio, SendGrid) and payments (e.g., PayMongo)
                                </li>
                                <li>When required by law or to protect legal rights</li>
                                <li>If landlords use our legal add-on services (only relevant details with consent)</li>
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground">4. Data Storage & Security</h2>
                            </div>
                            <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                                <li>All sensitive data is encrypted at rest and in transit</li>
                                <li>Passwords are securely hashed</li>
                                <li>Uploaded files are stored securely with access controls</li>
                                <li>We regularly monitor for security vulnerabilities</li>
                            </ul>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <UserCog className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground">5. Your Rights</h2>
                            </div>
                            <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">You can:</p>
                            <ul className="list-disc pl-8 sm:pl-10 mb-4 text-sm sm:text-base text-foreground space-y-1">
                                <li>View or update your profile and information</li>
                                <li>Request deletion of your account</li>
                                <li>Request data export</li>
                            </ul>
                            <p className="text-sm sm:text-base text-foreground mb-4">
                                Please email us at{" "}
                                <a href="mailto:CondoPal@gmail.com" className="text-primary hover:underline">
                                CondoPal@gmail.com
                                </a>{" "}
                                for any requests.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground">6. Changes to This Policy</h2>
                            </div>
                            <p className="text-sm sm:text-base text-foreground mb-4">
                                We may update this policy as needed. We will notify users of any major changes through email or app
                                notification.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground">7. Contact</h2>
                            </div>
                            <p className="text-sm sm:text-base text-foreground mb-3 sm:mb-4">
                                If you have questions or concerns about your privacy, contact us at:
                            </p>
                            <div className="flex items-center gap-2 mb-1">
                                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                                <p className="text-sm sm:text-base text-foreground">
                                Email:{" "}
                                <a href="mailto:support@condoPal.com" className="text-primary hover:underline">
                                    support@condoPal.com
                                </a>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                                <p className="text-sm sm:text-base text-foreground">Phone: +63 XXX XXX XXXX</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy