import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../config/api.js'
import toast from 'react-hot-toast'

function Jobs(){
    const [jobs, setJobs] = useState([])

    async function getJobs(){
        try{
            const res = await axios.get(`${BASE_URL}/api/jobs`)
            setJobs(res.data.jobs || [])
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(()=>{
        getJobs()
    }, [])

    return(
        <div className="min-h-screen bg-[#FBF6EC] p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FF5A3C]/10 text-[#FF5A3C] text-xs font-semibold font-mono-tag uppercase tracking-wide mb-2">
                        {jobs.length} open roles
                    </span>
                    <h1 className="text-[#171B2E] text-3xl font-bold" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                        Available Jobs
                    </h1>
                </div>

                {jobs.length === 0 ? (
                    <p className="text-[#171B2E]/50 font-medium">No jobs posted yet — check back soon.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white border-2 border-[#171B2E]/10 p-6 rounded-2xl hover:border-[#FF5A3C]/40 transition">
                                <h2 className="text-xl font-bold mb-2 text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                                    {job.title}
                                </h2>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[#171B2E]/60 text-sm">{job.location}</span>
                                    <span className="text-[#171B2E]/30">•</span>
                                    <span className="px-2 py-0.5 rounded-md bg-[#2F3EE0]/10 text-[#2F3EE0] text-xs font-semibold font-mono-tag uppercase">
                                        {job.type}
                                    </span>
                                </div>

                                <p className="text-[#17A673] font-bold font-mono-tag mb-4">
                                    Rs. {job.salary}
                                </p>

                                <Link
                                   to={`/apply/${job._id}`}
                                   className="w-full bg-[#FF5A3C] hover:bg-[#e64d2e] text-white py-2.5 rounded-lg block text-center font-bold transition">
                                    Apply
                               </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default Jobs