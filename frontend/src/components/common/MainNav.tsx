import { PropsWithChildren } from "react"
import NavBar from "./NavBar"

const MainNav = ({
    children,
}: PropsWithChildren) => {

    return (
        <>
            <NavBar />
            {children}
        </>
    )
}

export default MainNav