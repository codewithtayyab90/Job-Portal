const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization
        if(!authHeader){
            return res.status(401).json({
                message:"No Token Provided"
            })
        }
        const token = authHeader.split(" ") [1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        User.findByIdAndUpdate(decoded.id, { lastActiveAt: new Date() }).catch(function(){})
        next()

    }catch(err){
        console.log("auth error", err.message)
        res.status(401).json({
            message:"Invalid Token"
        })
    }
}
module.exports = authMiddleware