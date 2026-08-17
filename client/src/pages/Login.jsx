import { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom"
import BASE_URL from '../config/api.js';
import toast from 'react-hot-toast'


function Login(){
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();


    function changeHandler(e){
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    async function submitHandler(e){
        e.preventDefault()
        try{
            const res = await axios.post(`${BASE_URL}/api/auth/login`, formData)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            if(res.data.user.role === 'recruiter'){
                navigate('/dashboard')
                toast.success("Login Successfully")
            }else{
                navigate('/jobs')
                toast.success("Login Successfully")
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
                      <span className="inline-block px-3 py-1 rounded-full bg-[#FF5A3C]/10 text-[#FF5A3C] text-xs font-semibold font-mono-tag uppercase tracking-wide mb-3">
                          Welcome back
                      </span>
                      <h1 className="text-2xl font-bold leading-tight text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                          Sign in to your account
                      </h1>
                  </div>

                  <form className="space-y-4" onSubmit={submitHandler}>
                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-semibold text-[#171B2E]">
                              Your email
                          </label>
                          <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={changeHandler}
                              className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition"
                              placeholder="name@company.com"
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
                      <div className="flex items-center justify-between">
                          <div className="flex items-start">
                              <div className="flex items-center h-5">
                                  <input
                                      id="remember"
                                      aria-describedby="remember"
                                      type="checkbox"
                                      className="w-4 h-4 border-2 border-[#171B2E]/20 rounded accent-[#FF5A3C]"
                                  />
                              </div>
                              <div className="ml-3 text-sm">
                                  <label htmlFor="remember" className="text-[#171B2E]/70">Remember me</label>
                              </div>
                          </div>
                          <a href="#" className="text-sm font-semibold text-[#2F3EE0] hover:underline">
                              Forget password
                          </a>
                      </div>
                      <button
                          type="submit"
                          className="w-full text-white bg-[#FF5A3C] hover:bg-[#e64d2e] focus:ring-4 focus:outline-none focus:ring-[#FF5A3C]/30 font-bold rounded-lg text-sm px-5 py-3 text-center transition"
                      >
                          Sign in
                      </button>
                      <p className="text-sm font-medium text-[#171B2E]/60 text-center">
                          Don't have an account yet?{' '}
                          <Link to="/register" className="font-semibold text-[#2F3EE0] hover:underline">
                              Sign up
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
export default Login