import axios from 'axios'
import {useState} from 'react'
import BASE_URL from '../config/api.js'
import {useParams, useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'

function ApplyJob(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [coverNote, setCoverNote] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [cvUploaded, setCvUploaded] = useState(false)

    async function cvUploadHandler(){
        if(!selectedFile){
            toast.error("Please select a CV file first")
            return
        }
        try{
            const formData = new FormData()
            formData.append('cv', selectedFile)

            const token = localStorage.getItem('token')
            await axios.post(`${BASE_URL}/api/user/upload-cv`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success("CV uploaded successfully")
            setCvUploaded(true)
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }
    }

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

                {/* CV Upload — separate block */}
                <div className="bg-white border-2 border-[#171B2E]/10 rounded-2xl p-6 mb-4">
                    <label className="block mb-2 font-semibold text-[#171B2E]">
                        Upload CV
                    </label>
                    <p className="text-sm text-[#171B2E]/50 mb-3">
                        PDF or Word document — this will be attached to your profile.
                    </p>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="w-full p-3 bg-[#FBF6EC] border-2 border-[#171B2E]/15 rounded-lg text-[#171B2E] outline-none focus:border-[#FF5A3C] transition mb-3"
                    />

                    <button
                        type="button"
                        onClick={cvUploadHandler}
                        className="bg-[#2F3EE0] hover:bg-[#2632c2] text-white font-bold px-5 py-2.5 rounded-lg transition"
                    >
                        {cvUploaded ? "✓ CV Uploaded" : "Upload CV"}
                    </button>
                </div>

                {/* Cover Note — application form */}
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