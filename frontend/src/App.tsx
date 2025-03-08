import { Navigate, Route, Routes } from 'react-router-dom';
import AuthenticatedRoute from './components/common/Authorization/AuthenticatedRoute';
import NavBar from './components/common/NavBar';
import NotFound from './components/common/NotFound';
import { useAuthContext } from './context/AuthContext';
import Dashboard from './page/Dashboard/Dashboard';
import ForgotPassword from './page/ForgotPassword';
import HomePage from './page/HomePage';
import Login from './page/Login';
import PaymentSuccess from './page/Payment/PaymentSuccess';
import Pricing from './page/Payment/Pricing';
import RedirectToken from './page/RedirectToken';
import ResetForgottenPassword from './page/ResetForgottenPassword';
import SignUp from './page/SignUp';
import RequestMaintenance from './page/TenantDashboard/RequestMaintenance';
import EditMaintenance from './page/Dashboard/EditMaintenance';
import GcashPayment from './page/TenantDashboard/CondoPayment/GcashPayment';
import PaymongoPayment from './page/TenantDashboard/CondoPayment/PaymongoPayment';
import VerifyPaymongoPayment from './page/TenantDashboard/CondoPayment/VerifyPaymongoPayment';

const App = () => {
  const { user, isLoading } = useAuthContext();
  
  if(isLoading) {
    return 
    // loading spinner (but the problem is if it's fast it's like flickering)
    // (
    //   <div className='h-screen w-full flex items-center justify-center'>
    //     <LoadingSpinner />
    //   </div>
    // )
  }
  
  return (
    <div className='font-sans'>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Authentication Routes */}
        <Route path='/login' element={user ? <Navigate to={'/'} /> : <Login />} />
        <Route path='/signup' element={user ? <Navigate to={'/'} /> : <SignUp />} />
        <Route path="/redirecttoken" element={user ? <Navigate to={'/'} /> : <RedirectToken />} />
        <Route path='/forgot-password' element={user ? <Navigate to={'/'} /> : <ForgotPassword />} />
        <Route path='/forgot-password/reset' element={user ? <Navigate to={'/'} /> : <ResetForgottenPassword />} />

        {/* Subscription related routes */}
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/payment-status' element={
          <AuthenticatedRoute>
            <PaymentSuccess />
          </AuthenticatedRoute>
        } />
        
        {/* Dashboards Landlord */}
        <Route path='/dashboard/*' element={<Dashboard />} />
      
        {/* Dashboard Tenant */}
        <Route path='/maintenanceRequest' element={<RequestMaintenance />} />
        <Route path='/editMaintenanceRequest/:maintenanceId' element={<EditMaintenance />} />

        <Route path='/condoPayments/gcash/:condoId' element={<GcashPayment />} />
        <Route path='/condoPayments/manual' element={undefined} />
        <Route path='/condoPayments/paymongo/verify' element={<VerifyPaymongoPayment />} />
        <Route path='/condoPayments/paymongo/:condoId' element={<PaymongoPayment />} />

        {/* Error Pages */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
