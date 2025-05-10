import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuthContext } from "@/context/AuthContext"
import { Check, Lightbulb, Target } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import 'aos/dist/aos.css';
import AOS from 'aos';

const AboutUs = () => {
    const { user } = useAuthContext();

    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <div className="container mx-auto px-4 py-12 max-w-[1480px]">
            <section className="mb-12">
                <div className="flex flex-col items-center text-center">
                    <h1 data-aos="fade-up" data-aos-duration="700" className="text-4xl md:text-5xl font-bold mb-6">
                        About <span className="text-primary">CondoPal</span>
                    </h1>
                    <p data-aos="fade-up" data-aos-duration="700" data-aos-delay="200" className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                        Simplifying Condo Rental Management Through Technology
                    </p>
                    <div className="w-20 h-1 bg-primary mb-10"></div>
                </div>
            </section>

            <section className="mb-20">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <h2 data-aos="zoom-in" data-aos-duration="600" className="text-2xl md:text-4xl font-bold mb-4 text-primary">Our Story</h2>
                        <p data-aos="fade-right" data-aos-duration="500" className="text-base md:text-lg">
                            Managing rental properties should be simple, but for too many landlords, it's anything but. 
                            Endless spreadsheets, missed payments, and chaotic tenant communication turn what should be a straightforward investment into a daily frustration. 
                            That's why we created CondoPal—because rental management shouldn't feel like a second job.
                            <br /> <br />
                            Founded in 2025, CondoPal was born from firsthand experience. 
                            As condo owners ourselves, we knew the struggles of tracking rent across multiple platforms, fielding maintenance requests at all hours, and losing sleep over unpaid bills. 
                            We wanted a better way—one that gave landlords control and tenants transparency. So we built it.
                        </p>
                    </div>
                    <div data-aos="fade-left" data-aos-duration="600" data-aos-delay="200" 
                    className="flex-1 relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                        <img
                        src="/about/CondoPal-Team.jpg" alt="CondoPal team" className="object-cover" />
                    </div>
                </div>
            </section>

            <section className="mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div data-aos="fade-right" data-aos-duration="400" data-aos-delay="300" className="group">
                        <Card className="relative h-full overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-primary/5">
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                            <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 bg-primary/10 rounded-full"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 -mb-16 -ml-16 bg-primary/5 rounded-full"></div>

                            <div className="p-8 relative z-10">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-primary/20 rounded-full">
                                        <Target className="h-8 w-8 text-primary" />
                                    </div>
                                    <h2 className="text-lg md:text-3xl font-bold">Our Mission</h2>
                                </div>

                                {/* Content */}
                                <div className="space-y-5">
                                    <div className="pl-4 border-l-4 border-primary/30">
                                        <p className="text-lg leading-relaxed">
                                        CondoPal is dedicated to transforming condominium rental management by offering a centralized,
                                        automated, and secure platform for both owners and tenants.
                                        </p>
                                    </div>

                                    <p className="text-lg leading-relaxed">
                                        Our objective is to eliminate manual processes, ensure seamless financial tracking, and facilitate
                                        real-time communication through state-of-the-art digital solutions.
                                    </p>

                                    <p className="text-lg leading-relaxed">
                                        By combining trustworthy local payment systems and legal support, we empower landlords to manage
                                        properties efficiently while providing tenants with a simple, transparent, and reliable rental
                                        experience.
                                    </p>

                                    {/* Highlighted statement */}
                                    <div className="mt-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                                        <div className="text-primary font-semibold text-lg">
                                            Setting a new standard for modern condo management—where simplicity, security, and efficiency
                                            define every transaction.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div data-aos="fade-left" data-aos-duration="400" className="group">
                        <Card className="relative h-full overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-primary/5">
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                            <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 bg-primary/10 rounded-full"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 -mb-16 -ml-16 bg-primary/5 rounded-full"></div>

                            <div className="p-8 relative z-10">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-primary/20 rounded-full">
                                        <Lightbulb className="h-8 w-8 text-primary" />
                                    </div>
                                    <h2 className="text-lg md:text-3xl font-bold">Our Vision</h2>
                                </div>

                                <div className="space-y-5">
                                    <div className="pl-4 border-l-4 border-primary/30">
                                        <p className="text-lg leading-relaxed">
                                        To revolutionize the rental industry by becoming the leading condo management solution through
                                        innovation, automation, and transparency.
                                        </p>
                                    </div>

                                    <p className="text-lg leading-relaxed">
                                        We envision a future where technology bridges convenience and reliability—where landlords operate
                                        effortlessly, and tenants enjoy a seamless renting experience.
                                    </p>

                                    <p className="text-lg leading-relaxed">
                                        CondoPal aims to set the benchmark for modern condominium management, integrating secure digital
                                        transactions, real-time communication, and smart financial tracking.
                                    </p>

                                    <div className="mt-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                                        <div className="text-primary font-semibold text-lg">
                                            We're not just a service; we're a partner in delivering comfort, convenience, and peace of mind.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="mb-20">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div data-aos="zoom-in-right" data-aos-duration="600"
                    className="flex-1 relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                        <img src="/landing/LandingPage_Header.jpg" alt="CondoPal dashboard" className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <h2 data-aos="fade-right" data-aos-duration="600" className="text-3xl font-bold mb-2">
                            Why Choose CondoPal?
                        </h2>
                        <p data-aos="zoom-in" data-aos-duration="600" className="text-lg mb-4">We solve the biggest pain points of rental management:</p>
                        <ul className="space-y-4">
                            <li data-aos="fade-right" data-aos-duration="400" data-aos-delay="200" className="flex items-start gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Automated Rent Collection</h3>
                                    <p className="text-muted-foreground">
                                        GCash, bank transfers, or cash logging with photo verification.
                                    </p>
                                </div>
                            </li>
                            <li data-aos="fade-right" data-aos-duration="400" data-aos-delay="400" className="flex items-start gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Real-Time Financial Tracking</h3>
                                    <p className="text-muted-foreground">Income/expense reports at a glance.</p>
                                </div>
                            </li>
                            <li data-aos="fade-right" data-aos-duration="400" data-aos-delay="600" className="flex items-start gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Hassle-Free Communication</h3>
                                    <p className="text-muted-foreground">In-app chat and maintenance request tracking.</p>
                                </div>
                            </li>
                            <li data-aos="fade-right" data-aos-duration="400" data-aos-delay="800" className="flex items-start gap-3">
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                    <Check className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Legal & Compliance Support</h3>
                                    <p className="text-muted-foreground">Optional add-ons for lease agreements and dispute resolution.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="mb-12 bg-muted py-16 px-8 rounded-2xl">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 data-aos="zoom-in" data-aos-duration="400" className="text-4xl font-bold mb-6">Empowering Landlords. Enhancing Rental Living.</h2>
                    <p data-aos="fade-up" data-aos-duration="500" className="text-lg">
                        CondoPal transforms condo management into a seamless, smart experience. By simplifying communication,
                        automating rent collection, and centralizing key tasks, CondoPal empowers landlords to focus on growth—not
                        paperwork. At the same time, it improves the rental journey for tenants, fostering a more connected and
                        stress-free community.
                    </p>
                </div>
            </section>

             <section>
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Condo Management?</h2>
                    <Button data-aos="zoom-in" data-aos-duration="500" size="lg" className="px-8" asChild>
                        <Link to={user ? "/dashboard" : "/signup"}>
                            Get Started Today
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    )
}

export default AboutUs