import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import pages from "./pages"
import { useEffect, useState } from "react"
import Login from "./components/Login"
import "react-toastify/ReactToastify.css"
import { ToastContainer } from "react-toastify"

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = "$"

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || "")

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) :
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-6 text-base">
              <Routes>
                {pages.map((page, idx) => (
                  <Route key={idx} path={page.path} element={<page.element token={token} />} />
                ))}
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App
