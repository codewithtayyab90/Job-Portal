const express = require('express')
const router = express.Router()
const uploadCVFile = require('../middleware/upload.js')
const { uploadCV } = require('../controllers/applicationController.js')
const { getAllUsers } = require('../controllers/userController.js')
const middleware = require('../middleware/auth.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')

router.post('/upload-cv', middleware, roleMiddleware('candidate'), uploadCVFile, uploadCV)
router.get('/all-users', middleware, roleMiddleware('admin'), getAllUsers)

module.exports = router