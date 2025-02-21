import { Route, Routes } from 'react-router-dom';
import HomePage from './page/HomePage';
import Login from './page/Login';
import Pricing from './page/Pricing';
import RedirectToken from './page/RedirectToken';
import SignUp from './page/SignUp';
import ForgotPassword from './page/ForgotPassword';
import ResetForgottenPassword from './page/ResetForgottenPassword';

const App = () => {

  return (
    <div className='font-sans'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path="/redirecttoken" element={<RedirectToken />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/forgot-password/reset' element={<ResetForgottenPassword />} />
        <Route path='/price' element={<Pricing />} />
      </Routes>
    </div>
  )
}

export default App
