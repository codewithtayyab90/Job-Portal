import axios from "axios"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import BASE_URL from '../config/api.js'
import toast from 'react-hot-toast'
import StatusStepper from '../components/StatusStepper'

function Dashboard(){
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [applications, setApplications] = useState([])
    const [showApplications, setShowApplications] = useState(false)

    useEffect(()=>{
        const fetchJobs = async ()=>{
            try{
                const token = localStorage.getItem('token')
                const res = await axios.get(`${BASE_URL}/api/jobs/my-jobs`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setJobs(res.data.jobs)
            }catch(err){
                toast.error(err.response?.data?.message || "Something went wrong")
            }
        }
        fetchJobs()
    }, [])

    useEffect(()=>{
        const fetchApplications = async ()=>{
            try{
                const token = localStorage.getItem('token')
                const res = await axios.get(`${BASE_URL}/api/applications/received`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setApplications(res.data.applications)
            }catch(err){
                toast.error(err.response?.data?.message || "Something went wrong")
            }
        }
        fetchApplications()
    }, [])

    async function deleteJobHandler(id){
        try{
            const token = localStorage.getItem('token')
            await axios.delete(`${BASE_URL}/api/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setJobs(jobs.filter(job => job._id !== id))
            toast.success("Job deleted")
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }
    }

    async function statusChangeHandler(applicationId, newStatus){
        try{
            const token = localStorage.getItem('token')
            await axios.patch(`${BASE_URL}/api/applications/${applicationId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setApplications(applications.map(app =>
                app._id === applicationId ? {...app, status: newStatus} : app
            ))
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }
    }

    return(
        <div className="min-h-screen bg-[#FBF6EC] p-6">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-8 text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                    Dashboard
                </h1>

                <div className="grid md:grid-cols-4 gap-4 mb-10">
                    <div className="p-5 bg-white border-2 border-[#171B2E]/10 rounded-2xl">
                        <h2 className="text-sm font-semibold text-[#171B2E]/50 uppercase tracking-wide font-mono-tag">Total Jobs</h2>
                        <p className="text-3xl font-bold text-[#171B2E] mt-1">{jobs.length}</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-[#171B2E]/10 rounded-2xl">
                        <h2 className="text-sm font-semibold text-[#171B2E]/50 uppercase tracking-wide font-mono-tag">Active Jobs</h2>
                        <p className="text-3xl font-bold text-[#17A673] mt-1">
                            {jobs.filter(job => job.status === "approved").length}
                        </p>
                    </div>

                    <div
                        onClick={() => setShowApplications(!showApplications)}
                        className="p-5 bg-white border-2 border-[#FF5A3C]/30 rounded-2xl cursor-pointer hover:border-[#FF5A3C] transition"
                    >
                        <h2 className="text-sm font-semibold text-[#171B2E]/50 uppercase tracking-wide font-mono-tag">Total Applications</h2>
                        <p className="text-3xl font-bold text-[#FF5A3C] mt-1">{applications.length}</p>
                    </div>

                    <div className="p-5 bg-white border-2 border-[#171B2E]/10 rounded-2xl">
                        <h2 className="text-sm font-semibold text-[#171B2E]/50 uppercase tracking-wide font-mono-tag">Interviews</h2>
                        <p className="text-3xl font-bold text-[#171B2E] mt-1">0</p>
                    </div>
                </div>

                {showApplications && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold mb-4 text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                            Received Applications
                        </h2>
                        {applications.length === 0 ? (
                            <p className="text-[#171B2E]/50 font-medium">No applications yet.</p>
                        ) : (
                            applications.map((app) => (
                                <div key={app._id} className="p-5 mb-3 bg-white border-2 border-[#171B2E]/10 rounded-2xl">
                                    <h3 className="text-lg font-bold text-[#171B2E]">{app.job?.title}</h3>
                                    <p className="text-[#171B2E]/60 text-sm mt-1">
                                        {app.candidate?.name} — {app.candidate?.email}
                                    </p>
                                    <p className="mt-3 text-[#171B2E]/80">{app.coverNote}</p>

                                    <StatusStepper currentStatus={app.status} />

                                    <div className="mt-3 flex items-center gap-3">
                                        <label className="text-sm font-semibold text-[#171B2E]/60">Change status:</label>
                                        <select
                                            value={app.status}
                                            onChange={(e) => statusChangeHandler(app._id, e.target.value)}
                                            className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg p-2 font-medium outline-none focus:border-[#FF5A3C]"
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="interview">Interview</option>
                                            <option value="offered">Offered</option>
                                            <option value="hired">Hired</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold mb-4 text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                        Your Jobs
                    </h2>
                    {jobs.length === 0 ? (
                        <p className="text-[#171B2E]/50 font-medium">You haven't posted any jobs yet.</p>
                    ) : (
                        jobs.map((job) => (
                            <div key={job._id} className="p-5 mb-3 bg-white border-2 border-[#171B2E]/10 rounded-2xl">
                                <h3 className="text-xl font-bold text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                                    {job.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[#171B2E]/60 text-sm">{job.location}</span>
                                    <span className="text-[#171B2E]/30">•</span>
                                    <span className="px-2 py-0.5 rounded-md bg-[#2F3EE0]/10 text-[#2F3EE0] text-xs font-semibold font-mono-tag uppercase">
                                        {job.type}
                                    </span>
                                    <span className="text-[#171B2E]/30">•</span>
                                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold font-mono-tag uppercase ${
                                        job.status === 'approved' ? 'bg-[#17A673]/10 text-[#17A673]' :
                                        job.status === 'rejected' ? 'bg-[#E23F5E]/10 text-[#E23F5E]' :
                                        'bg-[#171B2E]/10 text-[#171B2E]/60'
                                    }`}>
                                        {job.status}
                                    </span>
                                </div>
                                <p className="text-[#17A673] font-bold font-mono-tag mt-2">Rs. {job.salary}</p>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => navigate(`/edit-job/${job._id}`)}
                                        className="bg-[#2F3EE0] hover:bg-[#2632c2] text-white px-4 py-2 rounded-lg font-semibold transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteJobHandler(job._id)}
                                        className="bg-[#E23F5E] hover:bg-[#c9314c] text-white px-4 py-2 rounded-lg font-semibold transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
export default Dashboard