import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import axiosFetch from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"

type TwoFactorAuthProps = {
    initial2FA: boolean
}

const TwoFactorAuth = ({
    initial2FA
}: TwoFactorAuthProps) => {
    const queryClient = useQueryClient();
    const [TwoFA, setTwoFA] = useState(initial2FA);

    const { mutate: handle2Fa } = useMutation({
        mutationKey: ["enable-2fa"],
        mutationFn: async (TwoFa: boolean) => {
            const response = await axiosFetch.patch("/user/2fa", {
                TwoFA: TwoFa
            })

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            return response.data
        },
        onSuccess: async (data) => {
            await queryClient.setQueryData(["user", "initial-data"], (oldData: any) => {
                return {
                    ...oldData,
                    TwoFA: data.TwoFA
                }
            })
            setTwoFA(data.TwoFA)
        },
        onError: () => {
            toast.error("failed to update 2FA!")
            setTwoFA(!TwoFA)
        }
    })

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-muted-foreground">
                            Use an authenticator app to generate one-time codes
                        </p>
                    </div>
                    <Switch checked={TwoFA} onCheckedChange={(value) => {
                        handle2Fa(value)
                        setTwoFA(value)
                    }} />
                </div>
                {/* <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                        <p className="font-medium">Text Message</p>
                        <p className="text-sm text-muted-foreground">Receive a code via SMS to verify your identity</p>
                    </div>
                    <Switch />
                </div> */}
            </CardContent>
        </Card>
    )
}

export default TwoFactorAuth