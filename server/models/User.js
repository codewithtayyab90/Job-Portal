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
        type:String
    },
    role:{
        type:String,
        enum:['candidate', 'recruiter', 'admin'],
        default:'candidate'
    },
    authProvider:{
        type:String,
        enum:['local', 'google'],
        default:'local'
    },
    googleId:{
        type:String
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