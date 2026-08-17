import axios from 'axios'
import {useState} from 'react'
import BASE_URL from '../config/api.js'
import {useParams, useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'

function ApplyJob(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [coverNote, setCoverNote] = useState('')

    async function submitHandler(e){
        e.preventDefault()
        try{
            const token = localStorage.getItem('token')
            const res = await axios.post(
                `${BASE_URL}/api/applications/${id}/apply`,
                {
                    coverNote
                },
                {
                    headers:{
                       Authorization:`Bearer ${token}` 
                    }
                }
            )
            if (res.status === 201){
                toast.success("Application submitted successfully")
                navigate('/jobs')
            }
        }catch(err){
           toast.error(err.response?.data?.message || "Something went wrong")
        }
    }

    return(
        <div className="min-h-screen bg-[#FBF6EC] p-6">
            <div className="max-w-2xl mx-auto">

                <span className="inline-block px-3 py-1 rounded-full bg-[#FF5A3C]/10 text-[#FF5A3C] text-xs font-semibold font-mono-tag uppercase tracking-wide mb-3">
                    New application
                </span>

                <h1 className="text-3xl font-bold mb-6 text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                    Apply For This Role
                </h1>

                <div className="bg-white border-2 border-[#171B2E]/10 rounded-2xl p-6">
                    <form onSubmit={submitHandler}>

                        <label className="block mb-2 font-semibold text-[#171B2E]">
                            Cover Note
                        </label>
                        <p className="text-sm text-[#171B2E]/50 mb-3">
                            Tell the recruiter why you're a good fit for this role.
                        </p>

                        <textarea
                            value={coverNote}
                            onChange={(e) => setCoverNote(e.target.value)}
                            placeholder="Write your cover note..."
                            rows="6"
                            className="w-full p-3 bg-[#FBF6EC] border-2 border-[#171B2E]/15 rounded-lg text-[#171B2E] outline-none focus:border-[#FF5A3C] focus:ring-2 focus:ring-[#FF5A3C]/20 transition"
                            required
                        />

                        <button
                            type="submit"
                            className="mt-4 w-full bg-[#FF5A3C] hover:bg-[#e64d2e] text-white font-bold px-5 py-3 rounded-lg transition"
                        >
                            Submit Application
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}
export default ApplyJob