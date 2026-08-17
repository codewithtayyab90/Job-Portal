const Job = require('../models/Job')
const Application = require('../models/Application')

const createJob = async(req,res)=>{
    try{
        const {title, description, type, location, salary, deadline, status} = req.body
        const jobDetails = await Job.create({
            title,
            description,
            type,
            location,
            salary,
            deadline,
            status,
            recruiter:req.user.id
        })
        res.status(201).json({
            message:"Job Created Successfully",
            job:jobDetails
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
const getAllJobs = async(req,res)=>{
    try{
        const jobs = await Job.find()
        res.status(200).json({
            message:"All Jobs",
            jobs
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
const getJobById = async(req,res)=>{
    try{
        const job = await Job.findById(req.params.id)
        res.status(200).json({
            message:"Job Details",
            job
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
const updateJob = async (req, res)=>{
    try{
        const job = await Job.findById(req.params.id)
        if(!job){
            return res.status(404).json({
                message:'Job Not Found'
            })
        }
        if(job.recruiter.toString() !== req.user.id){
            return res.status(403).json({
                message:'You can only edit your own jobs'
            })
        }
        const jobUpdate = await Job.findByIdAndUpdate(req.params.id, req.body, {new:true})
        return res.status(200).json({
            message:'Job Updated Succesfully',
            job:jobUpdate
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
const deleteJob = async (req, res)=>{
    try{
        const job = await Job.findById(req.params.id)
        if(!job){
            return res.status(404).json({ message:"Job not found" })
        }
        if(job.recruiter.toString() !== req.user.id){
            return res.status(403).json({ message:"You can only delete your own jobs" })
        }
        await Job.findByIdAndDelete(req.params.id)
        res.status(200).json({ message:"Job Deleted" })
    }catch(err){
        res.status(500).json({ message:err.message })
    }
}
const getJobApplications = async( req , res )=>{
    try{
        const applications = await Application.find({
            job: req.params.id
        })
        res.status(200).json({
            message: "Job Applications",
            applications
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
const getMyJobs = async(req, res)=>{
    try{
        const jobs = await Job.find({
            recruiter: req.user.id
        })
        res.status(200).json({
            message:"My Jobs",jobs
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports = {
    createJob, 
    getAllJobs, 
    getJobById, 
    updateJob, 
    getJobApplications,
    getMyJobs,
    deleteJob
}