import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/common/NavBar';
import ForgotPassword from './page/ForgotPassword';
import HomePage from './page/HomePage';
import Login from './page/Login';
import Pricing from './page/Pricing';
import RedirectToken from './page/RedirectToken';
import ResetForgottenPassword from './page/ResetForgottenPassword';
import SignUp from './page/SignUp';
import { useAuthContext } from './context/AuthContext';

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

        <Route path='/login' element={user ? <Navigate to={'/'} /> : <Login />} />
        <Route path='/signup' element={user ? <Navigate to={'/'} /> : <SignUp />} />
        <Route path="/redirecttoken" element={user ? <Navigate to={'/'} /> : <RedirectToken />} />
        <Route path='/forgot-password' element={user ? <Navigate to={'/'} /> : <ForgotPassword />} />
        <Route path='/forgot-password/reset' element={user ? <Navigate to={'/'} /> : <ResetForgottenPassword />} />

        <Route path='/pricing' element={<Pricing />} />

      </Routes>
    </div>
  )
}

export default App
