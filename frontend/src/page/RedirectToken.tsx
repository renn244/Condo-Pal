import LoadingSpinner from "@/components/common/LoadingSpinner"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

const RedirectToken = () => {
    const [searchParams] = useSearchParams()
    const access_token = searchParams.get("access_token")
    const refresh_token = searchParams.get("refresh_token")

    useEffect(() => {
        if(access_token) {
            localStorage.setItem("access_token", access_token)
            localStorage.setItem("refresh_token", refresh_token || "")

            const next = sessionStorage.getItem('next');

            window.location.href = next || "/"
        }
    }, [access_token, refresh_token])

    return (
        <div>
            <LoadingSpinner />
        </div>
    )
}

export default RedirectToken