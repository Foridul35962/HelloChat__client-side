import React, { useEffect } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Login'
import Registration from './pages/Registration'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, refreshToken } from './store/slices/authSlice'


const ProtectedRoute = ({ children }) => {
  const { accessToken, user, fetLoad } = useSelector(state => state.auth)

  if (!accessToken || fetLoad) {
    return <p className="text-white">Checking authentication...</p>
  }

  if (!accessToken && !user) {
    return <Navigate to="/login" />
  }

  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/registration',
    element: <Registration />
  }
])

const App = () => {

  const dispatch = useDispatch()
  const { accessToken, user } = useSelector(state => state.auth)

  useEffect(() => {
    if (!accessToken) {
      dispatch(refreshToken())
    } else if (accessToken && !user) {
      dispatch(fetchMe())
    }
  }, [accessToken, user, dispatch])

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-950 w-full">

      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-700/40 rounded-full blur-[100px]"></div>

      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/30 rounded-full blur-[100px]"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className='container mx-auto p-0 sm:p-5'>
        <div className="relative z-10 w-full p-5 sm:p-5 flex flex-col items-center justify-center">
          <RouterProvider router={router} />
          <ToastContainer />
        </div>
      </div>

    </div>
  )
}

export default App