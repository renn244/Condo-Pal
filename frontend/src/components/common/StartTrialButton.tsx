import axiosFetch from "@/lib/axios"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Button } from "../ui/button"
import LoadingSpinner from "./LoadingSpinner"

const StartTrialButton = ({ className }: { className?: string }) => {
    const { mutate, isPending } = useMutation({
        mutationKey: ['subscription', 'startTrial'],
        mutationFn: async () => {
            const response = await axiosFetch.post('/subscription/startTrial', {}, { validateStatus: () => true })

            if(response.status === 401) {
                window.location.assign('/login?next=/pricing');
                return null;
            }

            if(response.status >= 400) throw new Error(response.data.message);

            return response.data
        },
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            if(!data) return;
            toast.success('Your 14-day free trial has started')
            window.location.assign('/dashboard/dashboard')
        }
    })

    return (
        <Button variant="outline" disabled={isPending} onClick={() => mutate()} className={cn("w-full", className)}>
            {isPending ? <LoadingSpinner /> : "Start 14-day free trial"}
        </Button>
    )
}

export default StartTrialButton
