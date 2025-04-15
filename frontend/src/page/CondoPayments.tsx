import { Route, Routes } from "react-router-dom"
import ManualPayment from "./Dashboard/CondoPayment/ManualPayment"
import LandlordRoute from "@/components/common/Authorization/LandlordRoute"
import VerifyGcashPayment from "./Dashboard/CondoPayment/VerifyGcashPayment"
import TenantRoute from "@/components/common/Authorization/TenantRoute"
import GcashPayment from "./TenantDashboard/CondoPayment/GcashPayment"
import PaymongoPayment from "./TenantDashboard/CondoPayment/PaymongoPayment"
import VerifyPaymongoPayment from "./TenantDashboard/CondoPayment/VerifyPaymongoPayment"

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

            {/* Tenant */}
            <Route path='/gcash/:condoId' element={
                <TenantRoute>
                    <GcashPayment />
                </TenantRoute>
            } />
            <Route path='/paymongo/:condoId' element={
                <TenantRoute>
                    <PaymongoPayment />
                </TenantRoute>
            } />
            <Route path='/paymongo/verify' element={
                <TenantRoute>
                    <VerifyPaymongoPayment />
                </TenantRoute>
            } />
        </Routes>
    )
}

export default CondoPayments