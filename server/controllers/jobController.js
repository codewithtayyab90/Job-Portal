const Job = require('../models/Job')
const Application = require('../models/Application')
const Message = require('../models/Message')
const { DAY_MS, getHideBeforeDate } = require('../utils/jobDeadline.js')

const JOB_TYPES = ['full-time', 'part-time', 'internship']
const JOB_STATUSES = ['pending', 'approved', 'rejected']

function handleError(err, res){
    if(err.name === 'CastError'){
        return res.status(404).json({ message: 'Not found' })
    }
    res.status(500).json({ message: err.message })
}

function validateJobInput(body){
    const title = String(body.title || '').trim()
    const description = String(body.description || '').trim()
    const location = String(body.location || '').trim()
    const type = body.type
    const salary = Number(body.salary)
    const deadline = new Date(body.deadline)

    if(title.length < 3 || title.length > 100){
        return { error: 'Title must be between 3 and 100 characters' }
    }
    if(description.length < 20 || description.length > 5000){
        return { error: 'Description must be between 20 and 5000 characters' }
    }
    if(!JOB_TYPES.includes(type)){
        return { error: 'Select a valid job type' }
    }
    if(location.length < 2 || location.length > 100){
        return { error: 'Enter a valid location' }
    }
    if(!Number.isFinite(salary) || salary <= 0){
        return { error: 'Salary must be a number greater than 0' }
    }
    if(!body.deadline || isNaN(deadline.getTime())){
        return { error: 'Enter a valid deadline' }
    }
    if(deadline.getTime() + DAY_MS < Date.now()){
        return { error: 'Deadline cannot be in the past' }
    }

    return { data: { title, description, type, location, salary, deadline } }
}

const createJob = async(req,res)=>{
    try{
        const { error, data } = validateJobInput(req.body)
        if(error){
            return res.status(400).json({ message: error })
        }
        const job = await Job.create({
            ...data,
            recruiter: req.user.id
        })
        res.status(201).json({
            message:"Job Created Successfully",
            job
        })
    }catch(err){
        handleError(err, res)
    }
}

const getAllJobs = async(req,res)=>{
    try{
        const jobs = await Job.find({
            status: 'approved',
            $or: [
                { deadline: { $exists: false } },
                { deadline: null },
                { deadline: { $gte: getHideBeforeDate() } }
            ]
        }).sort({ _id: -1 })
        res.status(200).json({
            message:"All Jobs",
            jobs
        })
    }catch(err){
        handleError(err, res)
    }
}

const getJobById = async(req,res)=>{
    try{
        const job = await Job.findById(req.params.id)
        if(!job){
            return res.status(404).json({ message:'Job not found' })
        }
        res.status(200).json({
            message:"Job Details",
            job
        })
    }catch(err){
        handleError(err, res)
    }
}

const updateJob = async (req, res)=>{
    try{
        const job = await Job.findById(req.params.id)
        if(!job){
            return res.status(404).json({ message:'Job Not Found' })
        }
        if(job.recruiter.toString() !== req.user.id){
            return res.status(403).json({ message:'You can only edit your own jobs' })
        }

        const { error, data } = validateJobInput(req.body)
        if(error){
            return res.status(400).json({ message: error })
        }

        const jobUpdate = await Job.findByIdAndUpdate(req.params.id, data, {
            new: true,
            runValidators: true
        })
        return res.status(200).json({
            message:'Job Updated Succesfully',
            job:jobUpdate
        })
    }catch(err){
        handleError(err, res)
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

        const applications = await Application.find({ job: job._id }).select('_id')
        const applicationIds = applications.map(app => app._id)

        await Message.deleteMany({ application: { $in: applicationIds } })
        await Application.deleteMany({ job: job._id })
        await Job.findByIdAndDelete(job._id)

        res.status(200).json({ message:"Job Deleted" })
    }catch(err){
        handleError(err, res)
    }
}

const getJobApplications = async( req , res )=>{
    try{
        const job = await Job.findById(req.params.id)
        if(!job){
            return res.status(404).json({ message:'Job not found' })
        }
        if(job.recruiter.toString() !== req.user.id){
            return res.status(403).json({ message:'You can only view applications for your own jobs' })
        }
        const applications = await Application.find({ job: job._id })
        res.status(200).json({
            message: "Job Applications",
            applications
        })
    }catch(err){
        handleError(err, res)
    }
}

const getMyJobs = async(req, res)=>{
    try{
        const jobs = await Job.find({
            recruiter: req.user.id
        }).sort({ _id: -1 })
        res.status(200).json({
            message:"My Jobs",
            jobs
        })
    }catch(err){
        handleError(err, res)
    }
}

const getAllJobsAdmin = async (req, res) => {
    try{
        const jobs = await Job.find().populate('recruiter', 'name email').sort({ _id: -1 })
        res.status(200).json({
            message: "All Jobs (Admin)",
            jobs
        })
    }catch(err){
        handleError(err, res)
    }
}

const updateJobStatus = async (req, res) => {
    try{
        const { status } = req.body
        if(!JOB_STATUSES.includes(status)){
            return res.status(400).json({ message: "Invalid status" })
        }
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
        if(!job){
            return res.status(404).json({ message: "Job not found" })
        }
        res.status(200).json({
            message: "Job status updated",
            job
        })
    }catch(err){
        handleError(err, res)
    }
}

module.exports = {
    createJob, 
    getAllJobs, 
    getJobById, 
    updateJob, 
    getJobApplications,
    getMyJobs,
    deleteJob,
    getAllJobsAdmin,
    updateJobStatus
}