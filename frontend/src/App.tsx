import { Route, Routes } from "react-router-dom"
import { pages } from "./pages"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Searchbar from "./components/Searchbar"
import 'react-toastify/ReactToastify.css'
import { ToastContainer } from "react-toastify"

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <Searchbar />
      <Routes>
        {pages.map((page, idx) => (
          <Route key={idx} path={page.path} element={<page.element />} />
        ))}
      </Routes>
      <Footer />
    </div>
  )
}

export default App
