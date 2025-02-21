import FindYourAccount from "@/components/pageComponents/forgot-password/FindYourAccount"
import ResendEmail from "@/components/pageComponents/forgot-password/ResendEmail"
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from "react"

const ForgotPassword = () => {
    const [isSent, setIsSent] = useState<boolean>(false);

    return (
        <div className="min-h-screen flex justify-center items-center">
            <AnimatePresence mode="wait">
                {!isSent ? (
                    <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-[442.48px] w-full"
                    key="card1">
                        <FindYourAccount setIsSent={setIsSent} />
                    </motion.div>
                ) : (
                    <motion.div
                    initial={{ opacity: 0.5, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-[442.48px] w-full"
                    key="card2">
                        <ResendEmail />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ForgotPassword