import {Link, useNavigate} from 'react-router-dom'

function Navbar(){
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    function logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    return(
        <nav className="bg-[#FBF6EC] border-b-4 border-[#171B2E] px-6 py-4 flex justify-between items-center">
            <Link
                to="/jobs"
                className="text-2xl font-bold text-[#171B2E]"
                style={{fontFamily:"'Space Grotesk', sans-serif"}}
            >
                JobPortal
            </Link>

            <div className="flex gap-5 items-center">
                {user && (
                    <span className="text-[#171B2E]/60 text-sm font-medium hidden sm:inline">
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
        </nav>
    )
}
export default Navbar