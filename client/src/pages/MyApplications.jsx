import axios from "axios"
import {useEffect, useState} from "react"
import BASE_URL from '../config/api.js'
import toast from 'react-hot-toast'
import StatusStepper from '../components/StatusStepper'

function MyApplications(){
    const [applications, setApplications] = useState([])

    useEffect(()=>{
        const fetchApplications = async ()=>{
            try{
                const token = localStorage.getItem('token')
                const res = await axios.get(`${BASE_URL}/api/applications/myapplications`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setApplications(res.data.applications)
            }catch(err){
               toast.error(err.response?.data?.message || "Something went wrong")
            }
        }
        fetchApplications()
    }, [])

    return(
        <div className="min-h-screen bg-[#FBF6EC] p-6">
            <div className="max-w-3xl mx-auto">

                <div className="mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#2F3EE0]/10 text-[#2F3EE0] text-xs font-semibold font-mono-tag uppercase tracking-wide mb-2">
                        {applications.length} applications
                    </span>
                    <h1 className="text-3xl font-bold text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                        My Applications
                    </h1>
                </div>

                {applications.length === 0 ? (
                    <p className="text-[#171B2E]/50 font-medium">
                        You haven't applied to any jobs yet — go check out open roles.
                    </p>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="p-5 mb-4 bg-white border-2 border-[#171B2E]/10 rounded-2xl">
                            <h3 className="text-xl font-bold text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                                {app.job?.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[#171B2E]/60 text-sm">{app.job?.location}</span>
                                <span className="text-[#171B2E]/30">•</span>
                                <span className="px-2 py-0.5 rounded-md bg-[#2F3EE0]/10 text-[#2F3EE0] text-xs font-semibold font-mono-tag uppercase">
                                    {app.job?.type}
                                </span>
                            </div>

                            <p className="mt-3 text-[#171B2E]/70">{app.coverNote}</p>

                            <StatusStepper currentStatus={app.status} />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
export default MyApplications