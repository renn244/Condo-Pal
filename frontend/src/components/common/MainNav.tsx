import { PropsWithChildren } from "react"
import NavBar from "./NavBar"
import Footer from "../pageComponents/LandingPage/Footer"

const MainNav = ({
    children,
}: PropsWithChildren) => {

    return (
        <>
            <NavBar />
            {children}
            <Footer />
        </>
    )
}

export default MainNav