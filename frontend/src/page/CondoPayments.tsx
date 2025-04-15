import { Route, Routes } from "react-router-dom"
import ManualPayment from "./Dashboard/CondoPayment/ManualPayment"
import LandlordRoute from "@/components/common/Authorization/LandlordRoute"
import VerifyGcashPayment from "./Dashboard/CondoPayment/VerifyGcashPayment"

const CondoPayments = () => {
    return (
        <Routes>
            {/* Landlord */}
            <Route path='/manual/:condoId' element={
                <LandlordRoute>
                    <ManualPayment />
                </LandlordRoute>
            } />
            <Route path='/gcash/verify/:condoPaymentId' element={
                <LandlordRoute>
                    <VerifyGcashPayment />
                </LandlordRoute>
            } />

        </Routes>
    )
}

export default CondoPayments