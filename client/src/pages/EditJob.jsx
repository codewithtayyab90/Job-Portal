import axios from 'axios'
import {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import BASE_URL from '../config/api.js'
import toast from 'react-hot-toast'
import FormField, {inputClass} from '../components/FormField'

function EditJob(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
      title:"",
      description:"",
      type:"",
      location:"",
      salary:"",
      deadline:"",
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const today = new Date().toISOString().split('T')[0]

    useEffect(()=>{
        const fetchJob = async ()=>{
            try{
                const res = await axios.get(`${BASE_URL}/api/jobs/${id}`)
                const job = res.data.job
                setFormData({
                    title: job.title,
                    description: job.description,
                    type: job.type,
                    location: job.location,
                    salary: job.salary,
                    deadline: job.deadline ? job.deadline.split('T')[0] : ""
                })
                setLoading(false)
            }catch(err){
                toast.error(err.response?.data?.message || "Could not load this job")
                navigate('/dashboard')
            }
        }
        fetchJob()
    },[id, navigate])

    function changeHandler (e){
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
        if(String(formData.title).trim().length < 3){
            newErrors.title = "Title must be at least 3 characters"
        }
        if(String(formData.description).trim().length < 20){
            newErrors.description = "Description must be at least 20 characters"
        }
        if(!formData.type){
            newErrors.type = "Select a job type"
        }
        if(String(formData.location).trim().length < 2){
            newErrors.location = "Enter a location"
        }
        if(!formData.salary || Number(formData.salary) <= 0){
            newErrors.salary = "Enter a salary greater than 0"
        }
        if(!formData.deadline){
            newErrors.deadline = "Select a deadline"
        }else if(formData.deadline < today){
            newErrors.deadline = "Deadline cannot be in the past"
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
        setSaving(true)
        try{
            const token = localStorage.getItem('token')
            const res = await axios.patch(`${BASE_URL}/api/jobs/${id}`, {
                ...formData,
                title: String(formData.title).trim(),
                description: String(formData.description).trim(),
                location: String(formData.location).trim(),
                salary: Number(formData.salary)
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(res.status === 200){
                toast.success("Job Updated Successfully")
                navigate('/dashboard')
            }
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }finally{
            setSaving(false)
        }
    }

    if(loading) return (
        <div className="min-h-screen bg-[#FBF6EC] flex items-center justify-center">
            <p className="text-[#171B2E]/50 font-medium">Loading job details...</p>
        </div>
    )

    return(
        <div className="min-h-screen bg-[#FBF6EC] p-6">
            <div className="max-w-2xl mx-auto">

                <span className="inline-block px-3 py-1 rounded-full bg-[#2F3EE0]/10 text-[#2F3EE0] text-xs font-semibold font-mono-tag uppercase tracking-wide mb-3">
                    Editing listing
                </span>
                <h1 className="text-3xl font-bold mb-6 text-[#171B2E]" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
                    Edit Job
                </h1>

                <form className="bg-white border-2 border-[#171B2E]/10 rounded-2xl p-6" onSubmit={submitHandler} noValidate>

                    <FormField label="Job Title" error={errors.title}>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={changeHandler}
                            className={inputClass(errors.title)}
                        />
                    </FormField>

                    <FormField label="Description" error={errors.description}>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={changeHandler}
                            rows="5"
                            className={inputClass(errors.description)}
                        />
                    </FormField>

                    <FormField label="Job Type" error={errors.type}>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={changeHandler}
                            className={inputClass(errors.type)}
                        >
                            <option value="">Select job type</option>
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="internship">Internship</option>
                        </select>
                    </FormField>

                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                        <FormField label="Location" error={errors.location} className="">
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={changeHandler}
                                className={inputClass(errors.location)}
                            />
                        </FormField>

                        <FormField label="Salary (Rs.)" error={errors.salary} className="">
                            <input
                                type="number"
                                min="1"
                                name="salary"
                                value={formData.salary}
                                onChange={changeHandler}
                                className={inputClass(errors.salary)}
                            />
                        </FormField>
                    </div>

                    <FormField label="Application Deadline" error={errors.deadline} className="mb-6">
                        <input
                            type="date"
                            name="deadline"
                            min={today}
                            value={formData.deadline}
                            onChange={changeHandler}
                            className={inputClass(errors.deadline)}
                        />
                    </FormField>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full text-white bg-[#2F3EE0] hover:bg-[#2632c2] font-bold rounded-lg text-sm px-5 py-3 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Updating...' : 'Update Job'}
                    </button>

                </form>
            </div>
        </div>
    )
}
export default EditJob