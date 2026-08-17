const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("DB CONNECTED")
    }).catch(err=>{
        console.log("DB NOT CONNECTED")
    })
}

module.exports = connectDB