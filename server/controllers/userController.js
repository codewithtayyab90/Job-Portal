const User = require('../models/User.js')

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password')
        res.status(200).json({
            message: "All Users",
            users
        })
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getAllUsers }