import axios from 'axios'
import {useState} from 'react'
import BASE_URL from '../config/api.js'
import {useParams, useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx']

function ApplyJob(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [coverNote, setCoverNote] = useState('')
    const [coverNoteError, setCoverNoteError] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [cvUploaded, setCvUploaded] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    function fileChangeHandler(e){
        const file = e.target.files[0]
        setCvUploaded(false)
        if(!file){
            setSelectedFile(null)
            return
        }
        const extension = file.name.split('.').pop().toLowerCase()
        if(!ALLOWED_EXTENSIONS.includes(extension)){
            toast.error("Only PDF, DOC or DOCX files are allowed")
            e.target.value = ''
            setSelectedFile(null)
            return
        }
        if(file.size > MAX_FILE_SIZE){
            toast.error("File must be smaller than 5 MB")
            e.target.value = ''
            setSelectedFile(null)
            return
        }
        setSelectedFile(file)
    }

    async function cvUploadHandler(){
        if(!selectedFile){
            toast.error("Please select a CV file first")
            return
        }
        setUploading(true)
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
        }finally{
            setUploading(false)
        }
    }

    async function submitHandler(e){
        e.preventDefault()
        if(coverNote.trim().length < 20){
            setCoverNoteError("Cover note must be at least 20 characters")
            return
        }
        setCoverNoteError('')
        setSubmitting(true)
        try{
            const token = localStorage.getItem('token')
            const res = await axios.post(
                `${BASE_URL}/api/applications/${id}/apply`,
                {
                    coverNote: coverNote.trim()
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
        }finally{
            setSubmitting(false)
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
                        PDF or Word document, up to 5 MB — this will be attached to your profile.
                    </p>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={fileChangeHandler}
                        className="w-full p-3 bg-[#FBF6EC] border-2 border-[#171B2E]/15 rounded-lg text-[#171B2E] outline-none focus:border-[#FF5A3C] transition mb-3"
                    />

                    <button
                        type="button"
                        onClick={cvUploadHandler}
                        disabled={uploading}
                        className="bg-[#2F3EE0] hover:bg-[#2632c2] text-white font-bold px-5 py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {uploading ? "Uploading..." : cvUploaded ? "✓ CV Uploaded" : "Upload CV"}
                    </button>
                </div>

                {/* Cover Note — application form */}
                <div className="bg-white border-2 border-[#171B2E]/10 rounded-2xl p-6">
                    <form onSubmit={submitHandler} noValidate>

                        <label className="block mb-2 font-semibold text-[#171B2E]">
                            Cover Note
                        </label>
                        <p className="text-sm text-[#171B2E]/50 mb-3">
                            Tell the recruiter why you're a good fit for this role.
                        </p>

                        <textarea
                            value={coverNote}
                            onChange={(e) => {
                                setCoverNote(e.target.value)
                                setCoverNoteError('')
                            }}
                            placeholder="Write your cover note..."
                            rows="6"
                            className={`w-full p-3 bg-[#FBF6EC] border-2 rounded-lg text-[#171B2E] outline-none focus:border-[#FF5A3C] focus:ring-2 focus:ring-[#FF5A3C]/20 transition ${
                                coverNoteError ? 'border-[#E23F5E]' : 'border-[#171B2E]/15'
                            }`}
                        />
                        {coverNoteError && (
                            <p className="mt-1 text-xs font-semibold text-[#E23F5E]">{coverNoteError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-4 w-full bg-[#FF5A3C] hover:bg-[#e64d2e] text-white font-bold px-5 py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Application'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}
export default ApplyJob