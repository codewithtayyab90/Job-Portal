import axios from "axios"
import {useEffect, useState} from "react"
import BASE_URL from '../config/api.js'
import toast from 'react-hot-toast'

function AdminDashboard(){
    const [jobs, setJobs] = useState([])
    const [users, setUsers] = useState([])

    useEffect(()=>{
        const fetchJobs = async ()=>{
            try{
                const token = localStorage.getItem('token')
                const res = await axios.get(`${BASE_URL}/api/jobs/admin/all-jobs`, {
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
        const fetchUsers = async ()=>{
            try{
                const token = localStorage.getItem('token')
                const res = await axios.get(`${BASE_URL}/api/user/all-users`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUsers(res.data.users)
            }catch(err){
                toast.error(err.response?.data?.message || "Something went wrong")
            }
        }
        fetchUsers()
    }, [])

    async function statusChangeHandler(jobId, newStatus){
        try{
            const token = localStorage.getItem('token')
            await axios.patch(`${BASE_URL}/api/jobs/${jobId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setJobs(jobs.map(job => job._id === jobId ? {...job, status: newStatus} : job))
            toast.success("Status updated")
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }
    }

    return(
        <div className="min-h-screen bg-[#FBF6EC] p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                    Admin — All Jobs
                </h1>

                {jobs.map((job) => (
                    <div key={job._id} className="p-5 mb-3 bg-white border-2 border-[#171B2E]/10 rounded-2xl">
                        <h3 className="text-lg font-bold text-[#171B2E]">{job.title}</h3>
                        <p className="text-[#171B2E]/60 text-sm">
                            Posted by: {job.recruiter?.name} ({job.recruiter?.email})
                        </p>
                        <p className="text-[#171B2E]/60 text-sm">{job.location} • {job.type}</p>

                        <div className="mt-3 flex items-center gap-3">
                            <label className="text-sm font-semibold">Status:</label>
                            <select
                                value={job.status}
                                onChange={(e) => statusChangeHandler(job._id, e.target.value)}
                                className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 rounded-lg p-2"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                ))}

                <h2 className="text-2xl font-bold mt-10 mb-4 text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                    Registered Users ({users.length})
                </h2>
                {users.map((u) => (
                    <div key={u._id} className="p-4 mb-2 bg-white border-2 border-[#171B2E]/10 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-[#171B2E]">{u.name}</p>
                            <p className="text-sm text-[#171B2E]/60">{u.email}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold font-mono-tag uppercase ${
                            u.role === 'admin' ? 'bg-[#FF5A3C]/10 text-[#FF5A3C]' :
                            u.role === 'recruiter' ? 'bg-[#2F3EE0]/10 text-[#2F3EE0]' :
                            'bg-[#17A673]/10 text-[#17A673]'
                        }`}>
                            {u.role}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default AdminDashboard