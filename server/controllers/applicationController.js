const Application = require('../models/Application.js')
const Job = require('../models/Job.js')
const User = require('../models/User.js')
const { isApplicationOpen } = require('../utils/jobDeadline.js')

const APPLICATION_STATUSES = ['applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected']

function handleError(err, res){
    if(err.name === 'CastError'){
        return res.status(404).json({ message: 'Not found' })
    }
    res.status(500).json({ message: err.message })
}

const applyJob = async (req, res)=>{
    try{
        const jobId = req.params.id
        const candidateId = req.user.id
        const coverNote = String(req.body.coverNote || '').trim()

        if(req.user.role !== 'candidate'){
            return res.status(403).json({ message:'Only candidates can apply for jobs' })
        }
        if(coverNote.length < 20 || coverNote.length > 2000){
            return res.status(400).json({ message:'Cover note must be between 20 and 2000 characters' })
        }

        const job = await Job.findById(jobId)
        if(!job || job.status !== 'approved'){
            return res.status(404).json({ message:'Job not found' })
        }
        if(!isApplicationOpen(job.deadline)){
            return res.status(400).json({ message:'Application Deadline Has Passed' })
        }

        const candidate = await User.findById(candidateId)
        if(!candidate?.cvUrl){
            return res.status(400).json({ message:'Please upload your CV before applying' })
        }

        const application = await Application.create({
            job:jobId,
            candidate:candidateId,
            coverNote
        })
        res.status(201).json({
            message:"Applied Successfully",
            application
        })
    }catch(err){
        if(err.code === 11000){
            return res.status(400).json({
                message:'You have already applied to this job'
            })
        }
        handleError(err, res)
    }
}

const getMyApplications = async (req, res)=>{
    try{
        const candidateId = req.user.id
        const applications = await Application.find({
            candidate:candidateId,
        }).populate('job', 'title location type salary').sort({ appliedAt: -1 })
        res.status(200).json({
            message:"My Applications",
            applications
        })
    }catch(err){
        handleError(err, res)
    }
}

const updateApplication = async (req, res)=>{
    try{
        const { status } = req.body
        if(!APPLICATION_STATUSES.includes(status)){
            return res.status(400).json({ message:'Invalid status' })
        }

        const application = await Application.findById(req.params.id).populate('job')
        if(!application){
            return res.status(404).json({ message:"Application not found" })
        }
        if(application.job?.recruiter?.toString() !== req.user.id){
            return res.status(403).json({ message:"You can only manage applications for your own jobs" })
        }

        const applicationUpdate = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
        res.status(200).json({
            message:"Application Updated Successfully",
            application:applicationUpdate
        })
    }catch(err){
        handleError(err, res)
    }
}

const getReceivedApplications = async (req, res) => {
    try {
        const recruiterId = req.user.id

        const jobs = await Job.find({
            recruiter: recruiterId
        })

        const jobIds = jobs.map(job => job._id)

        const applications = await Application.find({
            job: { $in: jobIds }
        }).populate('job', 'title')
            .populate('candidate', 'name email cvUrl')
            .sort({ appliedAt: -1 })

        res.status(200).json({
            message: "Received Applications",
            applications
        })

    } catch (err) {
        handleError(err, res)
    }
}

const uploadCV = async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({ message: 'Please select a CV file' })
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { cvUrl: req.file.path },
            { returnDocument: 'after'  }
        )
        res.status(200).json({
            message: "CV uploaded successfully",
            cvUrl: user.cvUrl
        })
    }catch(err){
        handleError(err, res)
    }
}

module.exports = { applyJob, getMyApplications, updateApplication, getReceivedApplications, uploadCV }