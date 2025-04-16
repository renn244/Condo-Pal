import FeatureCard from "@/components/pageComponents/LandingPage/FeatureCard"
import { ChartNetwork, ChartNoAxesCombined, Globe, IdCard, MessageSquareMore, ReceiptText, Scale, Wrench } from "lucide-react"

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
                                        Investment app
                                    </div>
                                    <h1 className="py-8 text-center text-gray-900 font-bold font-manrope text-5xl lg:text-left leading-[70px]">
                                        The new standard for <span className="text-primary">Modern investor</span>
                                    </h1>
                                    <p className=" text-gray-500 text-lg text-center lg:text-left">
                                        When you’re ready to invest, quickly execute your orders with Complex and outdated.
                                    </p>
                                    <div className="relative p-1.5 my-10  flex  items-center gap-y-4 h-auto md:h-16 flex-col md:flex-row justify-between rounded-full md:shadow-[0px 15px 30px -4px rgba(16, 24, 40, 0.03)] border border-transparent md:bg-white transition-all duration-500 hover:border-indigo-600 focus-within:border-indigo-600">
                                        <input type="text" name="email" placeholder="Enter email to get started"
                                            className="text-base rounded-full text-gray-900 flex-1 py-4 px-6 shadow-[0px 15px 30px -4px rgba(16, 24, 40, 0.03)] md:shadow-none bg-white md:bg-transparent shadow-none placeholder:text-gray-400 focus:outline-none md:w-fit w-full" />
                                        <button className="bg-primary rounded-full py-3 px-7 text-base font-semibold text-white hover:bg-primary cursor-pointer transition-all duration-500 md:w-fit w-full">Get
                                            Started
                                        </button>
                                    </div>
                                    <div className="flex items-center flex-col lg:flex-row">
                                    <div className="flex items-center">
                                        <img src="https://pagedone.io/asset/uploads/1694846673.png" alt="Rounded image "
                                        className="border-2 border-solid border-indigo-50 rounded-full relative z-50 object-cover" />
                                        <img src="https://pagedone.io/asset/uploads/1694846691.png" alt="Rounded image"
                                        className="border-2 border-solid border-indigo-50 rounded-full relative z-30 -ml-3 object-cover" />
                                        <img src="https://pagedone.io/asset/uploads/1694846704.png" alt="Rounded image"
                                        className="border-2 border-solid border-indigo-50 rounded-full relative z-20 -ml-3 object-cover" />
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

            {/* Video Demo to an app */}
            <section className="pt-0 px-2 h-full mx-auto">
                <div className="relative z-10 mt-20 mb-8 max-w-7xl rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900 mx-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} {...feature} index={index} />
                    ))}
                </div>
            </section>
        </>
    )
}

export default HomePage  