const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['candidate', 'recruiter', 'admin'],
        default:'candidate'
    },
    isActive:{
        type: Boolean,
        default:true
    },
    cvUrl:{
        type:String,
    },
    resetToken:{
        type:String
    },
    resetTokenExpiry:{
        type:Date
    }
},
{ timestamps: true }
)
module.exports = mongoose.model('User', userSchema)