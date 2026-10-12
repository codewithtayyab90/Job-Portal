import { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom"
import BASE_URL from '../config/api.js';
import toast from 'react-hot-toast'
import { GoogleLogin } from '@react-oauth/google'

function Login(){
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    function changeHandler(e){
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setErrors({
            ...errors,
            [e.target.name]: ""
        })
    }

    function validate(){
        const newErrors = {}
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())){
            newErrors.email = "Enter a valid email address"
        }
        if(!formData.password){
            newErrors.password = "Password is required"
        }
        return newErrors
    }

    function redirectByRole(role){
        if(role === 'recruiter'){
            navigate('/dashboard')
        }else if(role === 'admin'){
            navigate('/admin-dashboard')
        }else{
            navigate('/jobs')
        }
    }

    async function submitHandler(e){
        e.preventDefault()
        const newErrors = validate()
        setErrors(newErrors)
        if(Object.keys(newErrors).length > 0){
            return
        }
        setLoading(true)
        try{
            const res = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: formData.email.trim(),
                password: formData.password
            })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            redirectByRole(res.data.user.role)
        }catch(err){
           toast.error(err.response?.data?.message || "Something went wrong")
        }finally{
            setLoading(false)
        }
    }

    async function googleSuccessHandler(credentialResponse){
        try{
            const res = await axios.post(`${BASE_URL}/api/auth/google`, {
                credential: credentialResponse.credential
            })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            toast.success("Logged in with Google")
            redirectByRole(res.data.user.role)
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

                  {/* Google Sign-In */}
                  <div className="flex justify-center">
                      <GoogleLogin
                          onSuccess={googleSuccessHandler}
                          onError={() => toast.error("Google Sign-In failed")}
                          shape="pill"
                          size="large"
                          width="300"
                          theme="outline"
                          text="continue_with"
                      />
                  </div>

                  <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-[#171B2E]/15"></div>
                      <span className="text-[#171B2E]/40 text-xs font-semibold uppercase">or</span>
                      <div className="flex-1 h-px bg-[#171B2E]/15"></div>
                  </div>

                  <form className="space-y-4" onSubmit={submitHandler} noValidate>
                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-semibold text-[#171B2E]">
                              Your email
                          </label>
                          <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={changeHandler}
                              className={`bg-[#FBF6EC] border-2 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition ${
                                  errors.email ? 'border-[#E23F5E]' : 'border-[#171B2E]/15'
                              }`}
                              placeholder="name@company.com"
                          />
                          {errors.email && (
                              <p className="mt-1 text-xs font-semibold text-[#E23F5E]">{errors.email}</p>
                          )}
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
                              className={`bg-[#FBF6EC] border-2 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition ${
                                  errors.password ? 'border-[#E23F5E]' : 'border-[#171B2E]/15'
                              }`}
                          />
                          {errors.password && (
                              <p className="mt-1 text-xs font-semibold text-[#E23F5E]">{errors.password}</p>
                          )}
                      </div>
                      <div className="flex items-center justify-end">
                          <Link to="/forgot-password" className="text-sm font-semibold text-[#2F3EE0] hover:underline">
                              Forget password
                          </Link>
                      </div>
                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full text-white bg-[#FF5A3C] hover:bg-[#e64d2e] focus:ring-4 focus:outline-none focus:ring-[#FF5A3C]/30 font-bold rounded-lg text-sm px-5 py-3 text-center transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                          {loading ? 'Signing in...' : 'Sign in'}
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