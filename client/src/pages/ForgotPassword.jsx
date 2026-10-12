import { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom"
import BASE_URL from '../config/api.js';
import toast from 'react-hot-toast'

function ForgotPassword(){
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function submitHandler(e){
        e.preventDefault()
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){
            setError("Enter a valid email address")
            return
        }
        setError("")
        setLoading(true)
        try{
            const res = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email: email.trim() })
            toast.success(res.data.message || "Check your email for reset link")
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }finally{
            setLoading(false)
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
                      <h1 className="text-2xl font-bold leading-tight text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                          Reset your password
                      </h1>
                      <p className="text-sm text-[#171B2E]/60 mt-2">
                          Enter your email we'll send you a link to reset your password
                      </p>
                  </div>

                  <form className="space-y-4" onSubmit={submitHandler} noValidate>
                      <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-semibold text-[#171B2E]">
                              Your email
                          </label>
                          <input
                              type="email"
                              name="email"
                              value={email}
                              onChange={(e)=>{
                                  setEmail(e.target.value)
                                  setError("")
                              }}
                              className={`bg-[#FBF6EC] border-2 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition ${
                                  error ? 'border-[#E23F5E]' : 'border-[#171B2E]/15'
                              }`}
                              placeholder="name@company.com"
                          />
                          {error && (
                              <p className="mt-1 text-xs font-semibold text-[#E23F5E]">{error}</p>
                          )}
                      </div>
                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full text-white bg-[#FF5A3C] hover:bg-[#e64d2e] focus:ring-4 focus:outline-none focus:ring-[#FF5A3C]/30 font-bold rounded-lg text-sm px-5 py-3 text-center transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                          {loading ? 'Sending...' : 'Send reset link'}
                      </button>
                      <p className="text-sm font-medium text-[#171B2E]/60 text-center">
                          <Link to="/" className="font-semibold text-[#2F3EE0] hover:underline">
                              Back to login
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
export default ForgotPassword