import FeatureCard from "@/components/pageComponents/LandingPage/FeatureCard"
import { Button } from "@/components/ui/button"
import { ChartNetwork, ChartNoAxesCombined, Globe, IdCard, MessageSquareMore, ReceiptText, Scale, Wrench } from "lucide-react"
import { Link } from "react-router-dom"

const HomePage = () => {
    const features = [
        {
            title: "Streamlined Rent Collection",
            description: "Facilitate rent payments through GCash, PayMongo, or manual cash entries. Automated reminders via email and SMS (integrated with SendGrid or Twilio) help ensure timely payments.",
            icon: <IdCard />,
        },
        {
            title: "Comprehensive Financial Tracking",
            description: "Automatically log rental income and maintenance expenses. Visualize transactions with an integrated calendar, providing a clear financial overview.",
            icon: <ChartNoAxesCombined />,
        },
        {
            title: "Efficient Maintenance Management",
            description: "Enable tenants to submit repair requests online. Track progress in real-time, maintain a history of requests, and determine responsibility for costs",
            icon: <Wrench />,
        },
        {
            title: "Real-Time Communication",
            description: "Facilitate instant messaging between landlords and tenants through a built-in chat system powered by WebSockets, ensuring prompt and organized communication.",
            icon: <MessageSquareMore />,
        },
        {
            title: "Detailed Payment Histories",
            description: "Maintain transparent records with automatically generated receipts and comprehensive payment histories accessible to both landlords and tenants.",
            icon: <ReceiptText />,
        },
        {
            title: "Insightful Dashboard Overview",
            description: "Access a centralized dashboard displaying key metrics such as unit occupancy, upcoming payments, and pending maintenance tasks, aiding in informed decision-making.​",
            icon: <ChartNetwork />,
        },
        {
            title: "Optional Legal Support Services",
            description: "Offer add-on services including legal assistance for tenant disputes and eviction processes, providing landlords with professional support when needed.",
            icon: <Scale />,
        },
        {
            title: "Tailored for Overseas Landlords",
            description: "Designed with Overseas Filipino Workers (OFWs) in mind, Condo Hub allows remote property management, ensuring landlords can oversee operations from anywhere.",
            icon: <Globe />,
        }
    ]

    return (
        <>
            {/* Hero Section  */}
            <section className="pt-0 px-2 h-full mx-auto">
                <div className="rounded-2xl py-5 overflow-hidden m-5 lg:m-0 2xl:py-11 xl:py-3  lg:rounded-tl-2xl lg:rounded-bl-2xl ">
                    <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-14 items-center lg:grid-cols-12 lg:gap32">
                            <div className="w-full xl:col-span-5 lg:col-span-6 2xl:-mx-5 xl:-mx-0">
                                <div className="flex items-center text-sm font-medium text-gray-500 justify-center lg:justify-start">
                                    <span className="bg-primary py-1 px-3 rounded-2xl text-xs font-medium text-white mr-3 ">#1</span>
                                    Condo Management Web App
                                </div>
                                <h1 className="py-4 text-center text-gray-900 font-bold font-manrope text-5xl lg:text-left leading-[70px]">
                                    The new standard for <span className="text-primary">Condo Management in Philippines</span>
                                </h1>
                                <p className=" text-gray-500 text-sm lg:text-lg text-center lg:text-left">
                                    CondoPal is a centralized platform that simplifies condo rental management by streamlining rent collection,
                                    communication, and tracking—making life easier for both landlords and tenants.
                                </p>
                                {/* <button className="bg-primary rounded-full py-3 px-7 text-base font-semibold text-white hover:bg-primary cursor-pointer transition-all duration-500 md:w-fit my-3">
                                    Get Started
                                </button> */}
                                <div className="flex items-center flex-col lg:flex-row mt-3">
                                    <div className="flex items-center">
                                        <img src="https://scontent.fmnl4-4.fna.fbcdn.net/v/t39.30808-1/476438701_1831289464302906_579132043874563226_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e99d92&_nc_ohc=HwZGVwuQkTAQ7kNvwECS9oL&_nc_oc=Adm6JB8SaPmIigK3el6xP4B516m0FnbB0GGOb-gF53PmszIAEOsux-DFU0yp0hPW9UHmiPJfs-7EN9rRl4t2lrMh&_nc_zt=24&_nc_ht=scontent.fmnl4-4.fna&_nc_gid=tF7mRVC6GKAwqsqJWEZCQw&oh=00_AfHaCZGq_mKpo0vxGqaat2Ufi0CHlnMqEdO3pc9Hrm91Dg&oe=680AC4E6" alt="Rounded image "
                                        className="border-2 border-solid border-indigo-50 rounded-full relative z-50 object-cover h-10" />
                                        <img src="https://scontent.fmnl4-7.fna.fbcdn.net/v/t39.30808-1/449657888_1444199612914122_4028637159301397245_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=LZ2RXL8rNfwQ7kNvwEA5E-D&_nc_oc=AdnW_WnsJCCQbdFCwV8JNffLdCCTbauwfO5xHNVq9BPWitjTCvr2EFk6rPHRekZ88xitPzoED5IOKkQznKebQToj&_nc_zt=24&_nc_ht=scontent.fmnl4-7.fna&_nc_gid=7b2l9FSQnMJ7gvN9uPx3Mg&oh=00_AfEPvfa_m4_-cY6DLwRcOGpvpPykZ8c3uzty7hPgTQKOhw&oe=680AACA2" alt="Rounded image"
                                        className="border-2 border-solid border-indigo-50 rounded-full relative z-30 -ml-3 object-cover h-10" />
                                        <img src="https://scontent.fmnl4-5.fna.fbcdn.net/v/t39.30808-1/491935753_2147078735811909_7695763110483343951_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_ohc=zc_flL6TibIQ7kNvwGxG04J&_nc_oc=AdlB_vCaUFqSCcYAhUtOe-C7eKSN-Hp7U41y3C-U_kCZia5t5bUyUhOULqCDICqTC6dMzePL-Io7tDYPixq-RKR0&_nc_zt=24&_nc_ht=scontent.fmnl4-5.fna&_nc_gid=vFS3r_ikYULNwua4IGeZXA&oh=00_AfGLFODIwsbjUYQ-55bDXDtdUwPhCccbaCqAankwWQKnig&oe=680AC6EE" alt="Rounded image"
                                        className="border-2 border-solid border-indigo-50 rounded-full relative z-20 -ml-3 object-cover h-10" />
                                    </div>
                                    <span className="mt-3 text-base text-gray-600 font-medium lg:ml-3">People have joined</span>
                                </div>
                            </div>
                            <div className="w-full xl:col-span-7 lg:col-span-6 block">
                                <div className="hidden w-full lg:block sm:w-auto lg:w-[60.8125rem] xl:ml-16 border-2 rounded-2xl">
                                    <img src="https://pagedone.io/asset/uploads/1694846193.png" alt="Dashboard image" className="rounded-l-3xl object-cover w-full lg:h-auto " />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 relative">
                <div className="w-full max-w-[1480px] px-4 md:px-5 lg:px-5 mx-auto">
                    <div className="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
                        <img className="lg:mx-0 mx-auto h-full rounded-3xl object-cover" src="https://pagedone.io/asset/uploads/1717751272.png" alt="about Us image" />
                        <div className="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                            <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                                <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                                    Empowering Landlords. Enhancing Rental Living.
                                </h2>
                                <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                                    CondoPal transforms condo management into a seamless, smart experience. 
                                    By simplifying communication, automating rent collection, and centralizing key tasks, CondoPal empowers landlords to focus on growth—not paperwork. 
                                    At the same time, it improves the rental journey for tenants, fostering a more connected and stress-free community.
                                </p>
                            </div>
                            <Button asChild>
                                <Link to="/signup">
                                    Get Started
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Demo to an app */}
            <section className="pt-0 px-2 h-full mx-auto">
                <div className="relative z-10 md:mt-20 md:mb-8 max-w-7xl rounded-3xl border border-neutral-200 bg-neutral-100 p-2 md:p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900 mx-auto">
                    <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
                        <img
                        src="https://assets.aceternity.com/pro/aceternity-landing.webp"
                        alt="Landing page preview"
                        className="aspect-[16/9] h-auto w-full object-cover"
                        height={1000}
                        width={1000}
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="pt-0 px-2 h-full mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-[1480px] mx-auto">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} {...feature} index={index} />
                    ))}
                </div>
            </section>
        </>
    )
}

export default HomePage  