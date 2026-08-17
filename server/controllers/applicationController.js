const Application = require('../models/Application.js')
const Job = require('../models/Job.js')

const applyJob = async (req, res)=>{
    try{
        const jobId = req.params.id
        const candidateId = req.user.id
        const {coverNote} = req.body
        const job = await Job.findById(jobId)
        if(!job){
            return res.status(400).json({
                message:"Job not found"
            })
        }
        if(job.deadline && new Date(job.deadline) < new Date()){
            return res.status(400).json({
                message:'Application Deadline Has Passed'
            })
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
        if(err.code ===  11000){
            return res.status(400).json({
                message:'You have already applied to this job'
            })
        }
        res.status(500).json({
            message:err.message
        })
    }
}
const getMyApplications = async (req, res)=>{
    try{
        const candidateId = req.user.id
        const applications = await Application.find({
            candidate:candidateId,
        }).populate('job', 'title location type salary')
        res.status(200).json({
            message:"My Applications",
            applications
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
const updateApplication = async (req, res)=>{
    try{
        const application = await Application.findById(req.params.id).populate('job')
        if(!application){
            return res.status(404).json({ message:"Application not found" })
        }
        if(application.job.recruiter.toString() !== req.user.id){
            return res.status(403).json({ message:"You can only manage applications for your own jobs" })
        }
        const applicationUpdate = await Application.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json({
            message:"Application Updated Successfully",
            application:applicationUpdate
        })
    }catch(err){
        res.status(500).json({ message:err.message })
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
            .populate('candidate', 'name email')

        res.status(200).json({
            message: "Received Applications",
            applications
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
module.exports = { applyJob, getMyApplications, updateApplication, getReceivedApplications }