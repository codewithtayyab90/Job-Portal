import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'

function Navbar(){
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [menuOpen, setMenuOpen] = useState(false)

    function logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    return(
        <nav className="bg-[#FBF6EC] border-b-4 border-[#171B2E] px-6 py-4">
            <div className="flex justify-between items-center">
                <Link
                    to="/jobs"
                    className="text-2xl font-bold text-[#171B2E]"
                    style={{fontFamily:"'Space Grotesk', sans-serif"}}
                >
                    JobPortal
                </Link>

                {/* Desktop links - hidden on small screens */}
                <div className="hidden md:flex gap-5 items-center">
                    {user && (
                        <span className="text-[#171B2E]/60 text-sm font-medium">
                            Hi, {user.name}
                        </span>
                    )}

                    {user?.role === 'recruiter' && (
                        <>
                            <Link to="/dashboard" className="text-[#171B2E] font-semibold hover:text-[#FF5A3C] transition">
                                Dashboard
                            </Link>
                            <Link
                                to="/create"
                                className="bg-[#FF5A3C] hover:bg-[#e64d2e] text-white px-4 py-2 rounded-lg font-bold transition"
                            >
                                Post Job
                            </Link>
                        </>
                    )}
                    {user?.role === 'admin' && (
                        <Link to="/admin-dashboard" className="text-[#171B2E] font-semibold hover:text-[#FF5A3C]">
                            Admin Panel
                        </Link>
                    )}
                    {user?.role === 'candidate' && (
                        <>
                            <Link to="/jobs" className="text-[#171B2E] font-semibold hover:text-[#FF5A3C] transition">
                                Jobs
                            </Link>
                            <Link to="/my-applications" className="text-[#171B2E] font-semibold hover:text-[#FF5A3C] transition">
                                My Applications
                            </Link>
                        </>
                    )}

                    <button
                        onClick={logout}
                        className="bg-[#E23F5E] hover:bg-[#c9314c] text-white px-4 py-2 rounded-lg font-bold transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Hamburger button - visible only on small screens */}
                <button
                    className="md:hidden text-[#171B2E] text-3xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col gap-4 mt-4 pb-2">
                    {user && (
                        <span className="text-[#171B2E]/60 text-sm font-medium">
                            Hi, {user.name}
                        </span>
                    )}

                    {user?.role === 'recruiter' && (
                        <>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-[#171B2E] font-semibold">
                                Dashboard
                            </Link>
                            <Link
                                to="/create"
                                onClick={() => setMenuOpen(false)}
                                className="bg-[#FF5A3C] text-white px-4 py-2 rounded-lg font-bold text-center"
                            >
                                Post Job
                            </Link>
                        </>
                    )}
                    {user?.role === 'admin' && (
                        <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)} className="text-[#171B2E] font-semibold">
                            Admin Panel
                        </Link>
                    )}
                    {user?.role === 'candidate' && (
                        <>
                            <Link to="/jobs" onClick={() => setMenuOpen(false)} className="text-[#171B2E] font-semibold">
                                Jobs
                            </Link>
                            <Link to="/my-applications" onClick={() => setMenuOpen(false)} className="text-[#171B2E] font-semibold">
                                My Applications
                            </Link>
                        </>
                    )}

                    <button
                        onClick={logout}
                        className="bg-[#E23F5E] text-white px-4 py-2 rounded-lg font-bold"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    )
}
export default Navbar