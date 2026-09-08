const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload.js')
const { uploadCV } = require('../controllers/applicationController.js')
const { getAllUsers } = require('../controllers/userController.js')
const middleware = require('../middleware/auth.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')

router.post('/upload-cv',middleware, upload.single('cv'), uploadCV)
router.get('/all-users', middleware, roleMiddleware('admin'), getAllUsers)
console.log("Registered routes:", router.stack.map(r => r.route?.path))

module.exports = router