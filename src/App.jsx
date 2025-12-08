import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify'
import Login from './pages/Login'
import Registration from './pages/Registration'

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: 'registration',
      element: <Registration />
    }
  ])

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-950 w-full">

      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-700/40 rounded-full blur-[100px]"></div>

      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/30 rounded-full blur-[100px]"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="relative z-10 w-full p-4 flex flex-col items-center justify-center">
        <RouterProvider router={router} />
        <ToastContainer />
      </div>

    </div>
  )
}

export default App