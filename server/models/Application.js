const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    },
    candidate:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        },
    coverNote:{
        type:String
        },
    status:{
        type:String,
        enum:['applied', 'shortlisted', 'interview', 'offered', 'hired','rejected'],
        default:'applied'
        },
    appliedAt:{
        type:Date,
        default:Date.now
        }
})

module.exports = mongoose.model('Application', applicationSchema.index({ job:1, candidate:1},{ unique:true}))