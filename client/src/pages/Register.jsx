import {useState}from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import BASE_URL from "../config/api.js"
import toast from 'react-hot-toast'

function Register(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "candidate"
    })
    const navigate = useNavigate();

    function changeHandler(e){
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function roleHandler(role){
        setFormData({
            ...formData,
            role: role
        })
    }

    async function submitHandler(e){
        e.preventDefault()
        try{
            const res = await axios.post(`${BASE_URL}/api/auth/register`, formData)
            if (res.status === 201){
                navigate('/')
                toast.success("User Register Succesfully")
            }
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }
    }
    return(
        <section className="bg-[#FBF6EC] min-h-screen">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full sm:max-w-md">

          <Link to="/" className="flex justify-center mb-6 text-2xl font-bold text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
              JobPortal
          </Link>

          <div className="w-full bg-white rounded-2xl border-2 border-[#171B2E]/10 shadow-sm">
              <div className="p-6 space-y-4 sm:p-8">
                  <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#2F3EE0]/10 text-[#2F3EE0] text-xs font-semibold font-mono-tag uppercase tracking-wide mb-3">
                          Get started
                      </span>
                      <h1 className="text-2xl font-bold leading-tight text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                          Create your account
                      </h1>
                  </div>

                  <form className="space-y-4" onSubmit={submitHandler}>

                      {/* Role toggle */}
                      <div>
                          <label className="block mb-2 text-sm font-semibold text-[#171B2E]">
                              I am a
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                              <button
                                  type="button"
                                  onClick={() => roleHandler('candidate')}
                                  className={`py-2.5 rounded-lg font-semibold text-sm border-2 transition ${
                                      formData.role === 'candidate'
                                          ? 'bg-[#FF5A3C] border-[#FF5A3C] text-white'
                                          : 'bg-[#FBF6EC] border-[#171B2E]/15 text-[#171B2E]/70'
                                  }`}
                              >
                                  Candidate
                              </button>
                              <button
                                  type="button"
                                  onClick={() => roleHandler('recruiter')}
                                  className={`py-2.5 rounded-lg font-semibold text-sm border-2 transition ${
                                      formData.role === 'recruiter'
                                          ? 'bg-[#FF5A3C] border-[#FF5A3C] text-white'
                                          : 'bg-[#FBF6EC] border-[#171B2E]/15 text-[#171B2E]/70'
                                  }`}
                              >
                                  Recruiter
                              </button>
                          </div>
                      </div>

                      <div>
                          <label htmlFor="name" className="block mb-2 text-sm font-semibold text-[#171B2E]">
                              Full name
                          </label>
                          <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={changeHandler}
                              className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition"
                              placeholder="Enter your full name"
                              required
                          />
                      </div>

                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-semibold text-[#171B2E]">
                              Email
                          </label>
                          <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={changeHandler}
                              className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition"
                              placeholder="email@company.com"
                              required
                          />
                      </div>

                      <div>
                          <label htmlFor="password" className="block mb-2 text-sm font-semibold text-[#171B2E]">
                              Password
                          </label>
                          <input
                              type="password"
                              name="password"
                              id="password"
                              value={formData.password}
                              onChange={changeHandler}
                              placeholder="••••••••"
                              className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition"
                              required
                          />
                      </div>

                      <button
                          type="submit"
                          className="w-full text-white bg-[#FF5A3C] hover:bg-[#e64d2e] focus:ring-4 focus:outline-none focus:ring-[#FF5A3C]/30 font-bold rounded-lg text-sm px-5 py-3 text-center transition"
                      >
                          Create account
                      </button>

                      <p className="text-sm font-medium text-[#171B2E]/60 text-center">
                          Already have an account?{' '}
                          <Link to="/" className="font-semibold text-[#2F3EE0] hover:underline">
                              Login
                          </Link>
                      </p>
                  </form>
              </div>
          </div>
      </div>
  </div>
</section>
    )
}
export default Register