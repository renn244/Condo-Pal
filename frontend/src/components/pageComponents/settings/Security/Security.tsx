import { useAuthContext } from "@/context/AuthContext"
import OAuthCard from "./Oauth"
import ChangePassword from "./ChangePassword"
import TwoFactorAuth from "./TwoFactorAuth"

type SecurityProps = {
    initial2FA: boolean
}

const Security = ({
    initial2FA
}: SecurityProps) => {
    
    const { user } = useAuthContext();

    if(user?.isOAuth) {
        return <OAuthCard />
    }

    return (
        <>
            <ChangePassword />

            <TwoFactorAuth initial2FA={initial2FA} />
        </>
    )
}

export default Security