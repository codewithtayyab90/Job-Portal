import { useState } from "react";
import axios from 'axios';
import { useNavigate, useParams, Link } from "react-router-dom"
import BASE_URL from '../config/api.js';
import toast from 'react-hot-toast'

function ResetPassword(){
    const [password, setPassword] = useState("")
    const { token } = useParams()
    const navigate = useNavigate()

    async function submitHandler(e){
        e.preventDefault()
        try{
            const res = await axios.post(`${BASE_URL}/api/auth/reset-password/${token}`, { password })
            toast.success(res.data.message || "Password reset successful")
            navigate('/')
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
                      <h1 className="text-2xl font-bold leading-tight text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                          Set a new password
                      </h1>
                  </div>

                  <form className="space-y-4" onSubmit={submitHandler}>
                      <div>
                          <label htmlFor="password" className="block mb-2 text-sm font-semibold text-[#171B2E]">
                              New password
                          </label>
                          <input
                              type="password"
                              name="password"
                              value={password}
                              onChange={(e)=>setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg focus:ring-2 focus:ring-[#FF5A3C] focus:border-[#FF5A3C] block w-full p-2.5 outline-none transition"
                              required
                          />
                      </div>
                      <button
                          type="submit"
                          className="w-full text-white bg-[#FF5A3C] hover:bg-[#e64d2e] focus:ring-4 focus:outline-none focus:ring-[#FF5A3C]/30 font-bold rounded-lg text-sm px-5 py-3 text-center transition"
                      >
                          Update password
                      </button>
                  </form>
              </div>
          </div>
      </div>
  </div>
</section>
    )
}
export default ResetPassword