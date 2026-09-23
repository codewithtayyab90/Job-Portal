const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../db-configuration/email.js')

const register = async(req,res)=>{
    try{
        const {name, email, password, role} = req.body
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({ message: "Email Already Exist"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role
        })
        const {password:_, ...userWithoutPassword} = user.toObject()
       return res.status(201).json({
            message:"User Created Successfully",
            user: userWithoutPassword
        })
    } catch(err) {
        console.log("registration error", err)
        res.status(500).json({
            message:err.message,
        }) 
    }
}
const login = async(req,res)=>{
    try{
        const {email, password} = req.body
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(404).json({
                message:"User Not Found"
            })
        }
            const isMatch = await bcrypt.compare(
                password,
                existingUser.password)

            if(!isMatch){
                return res.status(401).json({
                    message:"Invalid Password"
                })
            }
            const token = jwt.sign({
                id: existingUser._id,
                role: existingUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn:'7d'}
        )
        const {password:_, ...userWithoutPassword} = existingUser.toObject()
          return  res.status(200).json({
                message:"Login Successfully",
                token,
                user:userWithoutPassword
            })
    }catch(err){
        res.status(500).json({
            message:err.message
        })

    }
}

const forgotPassword = async(req,res)=>{
    try{
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                message:"No account with this email"
            })
        }
        const token = crypto.randomBytes(32).toString('hex')
        user.resetToken = token
        user.resetTokenExpiry = Date.now() + 3600000
        await user.save()

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`

        await sendEmail({
            to: user.email,
            subject: "Password Reset - JobPortal",
            html: `<p>Click below to reset your password (valid for 1 hour):</p><a href="${resetLink}">${resetLink}</a>`
        })

        res.status(200).json({ message: "Reset link sent to your email" })
    }catch(err){
        console.log("forgot password error", err)
        res.status(500).json({ message: err.message })
    }
}

const resetPassword = async(req,res)=>{
    try{
        const {token} = req.params
        const {password} = req.body

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        })

        if(!user){
            return res.status(400).json({ message: "Invalid or expired reset link" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetToken = undefined
        user.resetTokenExpiry = undefined
        await user.save()

        res.status(200).json({ message: "Password reset successful" })
    }catch(err){
        console.log("reset password error", err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = { register, login, forgotPassword, resetPassword }