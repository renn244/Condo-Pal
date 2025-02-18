import { Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import SignUp from './page/SignUp';
import HomePage from './page/HomePage';
import RedirectToken from './page/RedirectToken';

const App = () => {

  return (
    <div className='font-sans'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path="/redirecttoken" element={<RedirectToken />} />
      </Routes>
    </div>
  )
}

export default App
