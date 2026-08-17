import axios from "axios"
import {useState} from "react"
import {useNavigate} from 'react-router-dom'
import BASE_URL from '../config/api.js'
import toast from 'react-hot-toast'

function CreateJob(){
    const [formData, setFormData] = useState({
      title:"",
      description:"",
      type:"",
      location:"",
      salary:"",
      deadline:"",
      status:"pending",
      recruiter:""
    })
    const navigate = useNavigate()

    function changeHandler(e){
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    async function submitHandler(e){
        e.preventDefault()
        try{
            const token = localStorage.getItem('token')
            const res = await axios.post(`${BASE_URL}/api/jobs`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if (res.status === 201){
                toast.success("Job Created Successfully")
                navigate('/dashboard')
            }
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }
    }

    return(
        <div className="min-h-screen bg-[#FBF6EC] p-6">
            <div className="max-w-2xl mx-auto">

                <span className="inline-block px-3 py-1 rounded-full bg-[#2F3EE0]/10 text-[#2F3EE0] text-xs font-semibold font-mono-tag uppercase tracking-wide mb-3">
                    New listing
                </span>
                <h1 className="text-3xl font-bold mb-6 text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                    Post a Job
                </h1>

                <form className="bg-white border-2 border-[#171B2E]/10 rounded-2xl p-6" onSubmit={submitHandler}>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-[#171B2E]">
                            Job Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={changeHandler}
                            placeholder="e.g. Frontend Developer"
                            className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg block w-full p-3 outline-none focus:border-[#FF5A3C] focus:ring-2 focus:ring-[#FF5A3C]/20 transition"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-[#171B2E]">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={changeHandler}
                            placeholder="Describe the job..."
                            rows="5"
                            className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg block w-full p-3 outline-none focus:border-[#FF5A3C] focus:ring-2 focus:ring-[#FF5A3C]/20 transition"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-[#171B2E]">
                            Job Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={changeHandler}
                            className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg block w-full p-3 outline-none focus:border-[#FF5A3C]"
                            required
                        >
                            <option value="">Select job type</option>
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-[#171B2E]">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={changeHandler}
                                placeholder="e.g. Lahore"
                                className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg block w-full p-3 outline-none focus:border-[#FF5A3C] focus:ring-2 focus:ring-[#FF5A3C]/20 transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-[#171B2E]">
                                Salary
                            </label>
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={changeHandler}
                                placeholder="e.g. 80,000 PKR"
                                className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg block w-full p-3 outline-none focus:border-[#FF5A3C] focus:ring-2 focus:ring-[#FF5A3C]/20 transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-semibold text-[#171B2E]">
                            Application Deadline
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={changeHandler}
                            className="bg-[#FBF6EC] border-2 border-[#171B2E]/15 text-[#171B2E] rounded-lg block w-full p-3 outline-none focus:border-[#FF5A3C]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white bg-[#FF5A3C] hover:bg-[#e64d2e] font-bold rounded-lg text-sm px-5 py-3 transition"
                    >
                        Post Job
                    </button>

                </form>
            </div>
        </div>
    )
}
export default CreateJob