const multer = require('multer')
const { storage } = require('../db-configuration/cloudinary.js')

const upload = multer({ storage })

module.exports = upload