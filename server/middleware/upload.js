const multer = require('multer')
const path = require('path')
const { storage } = require('../db-configuration/cloudinary.js')

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx']

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: function(req, file, cb){
        const extension = path.extname(file.originalname).toLowerCase()
        if(!ALLOWED_EXTENSIONS.includes(extension)){
            return cb(new Error('Only PDF, DOC or DOCX files are allowed'))
        }
        cb(null, true)
    }
})

function uploadCVFile(req, res, next){
    upload.single('cv')(req, res, function(err){
        if(err){
            const message = err.code === 'LIMIT_FILE_SIZE'
                ? 'File must be smaller than 5 MB'
                : err.message
            return res.status(400).json({ message })
        }
        next()
    })
}

module.exports = uploadCVFile