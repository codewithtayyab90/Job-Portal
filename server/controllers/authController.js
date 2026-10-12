const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../db-configuration/email.js')
const { OAuth2Client } = require('google-auth-library')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const ALLOWED_ROLES = ['candidate', 'recruiter']
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isStrongPassword(password){
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
}

const register = async(req,res)=>{
    try{
        const name = String(req.body.name || '').trim()
        const email = String(req.body.email || '').trim()
        const password = String(req.body.password || '')
        const role = ALLOWED_ROLES.includes(req.body.role) ? req.body.role : 'candidate'

        if(name.length < 2){
            return res.status(400).json({ message: "Name must be at least 2 characters" })
        }
        if(!EMAIL_REGEX.test(email)){
            return res.status(400).json({ message: "Enter a valid email address" })
        }
        if(!isStrongPassword(password)){
            return res.status(400).json({ message: "Password must be 8+ characters with a letter and a number" })
        }

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
        if(!existingUser.password){
            return res.status(400).json({
                message:"This account was created with Google. Use the Google button, or set a password using Forget password."
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
        return res.status(200).json({
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

const googleAuth = async(req,res)=>{
    try{
        const { credential, role } = req.body

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload()
        const { email, name, sub: googleId } = payload

        if(!payload.email_verified){
            return res.status(400).json({ message: "Google email is not verified" })
        }

        let user = await User.findOne({ email })

        if(user){
            if(!user.googleId){
                user.googleId = googleId
                await user.save()
            }
        } else {
            user = await User.create({
                name,
                email,
                googleId,
                authProvider: 'google',
                role: ALLOWED_ROLES.includes(role) ? role : 'candidate'
            })
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn:'7d'}
        )

        const { password:_p, resetToken:_r, resetTokenExpiry:_e, ...safeUser } = user.toObject()

        res.status(200).json({
            message:"Login Successfully",
            token,
            user: safeUser
        })
    }catch(err){
        console.log("google auth error", err)
        res.status(500).json({ message: err.message })
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
        const password = String(req.body.password || '')

        if(!isStrongPassword(password)){
            return res.status(400).json({ message: "Password must be 8+ characters with a letter and a number" })
        }

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

module.exports = { register, login, googleAuth, forgotPassword, resetPassword }