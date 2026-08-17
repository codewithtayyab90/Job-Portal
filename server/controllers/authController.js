const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

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

module.exports = { register, login }
