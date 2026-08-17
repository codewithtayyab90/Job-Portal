const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['full-time', 'part-time','internship']
    },
    location:{
        type:String,
        required:true
    },
    salary:{
        type:Number
    },
    deadline:{
        type:Date
    },
    status:{
        type:String,
        enum:['pending', 'approved', 'rejected'],
        default:'pending'
    },
    recruiter:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
})

module.exports = mongoose.model('Job', jobSchema)