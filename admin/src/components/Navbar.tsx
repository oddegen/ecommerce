import { assets } from "../assets/assets"

interface NavbarProps {
    setToken: React.Dispatch<React.SetStateAction<string>>
}

const Navbar = ({ setToken }: NavbarProps) => {
    return (
        <div className="flex items-center py-2 px-[4%] justify-between">
            <img className="w-[max(10%, 80px)]" src={assets.logo} alt="" />
            <button onClick={() => setToken('')} className="bg-gray-600 text-white px-5 py-2 sm:px-7 rounded-full text-xs sm:text-sm">Logout</button>
        </div>
    )
}

export default Navbar
