import {useState}from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import BASE_URL from "../config/api.js"
import toast from 'react-hot-toast'
import { GoogleLogin } from '@react-oauth/google'

function Register(){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "candidate"
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

    function roleHandler(role){
        setFormData({
            ...formData,
            role: role
        })
    }

    function validate(){
        const newErrors = {}
        if(formData.name.trim().length < 2){
            newErrors.name = "Name must be at least 2 characters"
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())){
            newErrors.email = "Enter a valid email address"
        }
        if(formData.password.length < 8 || !/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)){
            newErrors.password = "Password must be 8+ characters with a letter and a number"
        }
        return newErrors
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
            const res = await axios.post(`${BASE_URL}/api/auth/register`, formData)
            if (res.status === 201){
                navigate('/')
                toast.success("User Register Succesfully")
            }
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }finally{
            setLoading(false)
        }
    }

    async function googleSuccessHandler(credentialResponse){
        try{
            const res = await axios.post(`${BASE_URL}/api/auth/google`, {
                credential: credentialResponse.credential,
                role: formData.role
            })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            toast.success("Logged in with Google")

            if(res.data.user.role === 'recruiter'){
                navigate('/dashboard')
            }else if(res.data.user.role === 'admin'){
                navigate('/admin-dashboard')
            }else{
                navigate('/jobs')
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

                  <form className="space-y-4" onSubmit={submitHandler} noValidate>

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

                      {/* Google Sign-In */}
                      <div className="flex justify-center">
                          <GoogleLogin
                            onSuccess={googleSuccessHandler}
                            onError={() => toast.error("Google Sign-In failed")}
                            shape="pill"
                            size="large"
                            width="300"
                            theme="outline"
                            />
                      </div>

                      <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-[#171B2E]/15"></div>
                          <span className="text-[#171B2E]/40 text-xs font-semibold uppercase">or</span>
                          <div className="flex-1 h-px bg-[#171B2E]/15"></div>
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
                              className={`bg-[#FBF6EC] border-2 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition ${
                                  errors.name ? 'border-[#E23F5E]' : 'border-[#171B2E]/15'
                              }`}
                              placeholder="Enter your full name"
                          />
                          {errors.name && (
                              <p className="mt-1 text-xs font-semibold text-[#E23F5E]">{errors.name}</p>
                          )}
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
                              className={`bg-[#FBF6EC] border-2 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition ${
                                  errors.email ? 'border-[#E23F5E]' : 'border-[#171B2E]/15'
                              }`}
                              placeholder="email@company.com"
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

                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full text-white bg-[#FF5A3C] hover:bg-[#e64d2e] focus:ring-4 focus:outline-none focus:ring-[#FF5A3C]/30 font-bold rounded-lg text-sm px-5 py-3 text-center transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                          {loading ? 'Creating account...' : 'Create account'}
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