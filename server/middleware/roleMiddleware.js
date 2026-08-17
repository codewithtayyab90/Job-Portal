const roleMiddleware = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return res.status(403).json({
                message:"Access Denied - don't have permission to access this resource"
            })
        }
        next()
    }
}
module.exports = roleMiddleware