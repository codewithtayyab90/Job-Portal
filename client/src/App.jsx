import { BrowserRouter, Routes, Route, useLocation,} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Jobs from './pages/Jobs'
import Create from './pages/Create'
import Dashboard from './pages/Dashboard'
import ApplyJob from './pages/ApplyJob'
import MyApplications from './pages/MyApplications'
import EditJob from './pages/EditJob'
import { Toaster } from 'react-hot-toast'

  function Layout(){
    const location = useLocation();
    const hideNavbar = ['/', '/register'].includes(location.pathname)
    return(
      <>
      <Toaster position="top-center" />
    {!hideNavbar && <Navbar />}
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/jobs' element={<Jobs />} />
      <Route path='/create' element={<Create />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/apply/:id' element={<ApplyJob />} />
      <Route path='/applications' element={<ApplyJob />} />
      <Route path='/edit-job/:id' element={<EditJob />} />
      <Route path='/my-applications' element={<MyApplications />} />
    </Routes>
    </>
  )
}
  function App(){
    return(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    )
  }
export default App