const express = require('express')
const router = express.Router()
const middleware = require('../middleware/auth.js')
const { getMessages, sendMessage } = require('../controllers/messageController.js')

router.get('/:applicationId', middleware, getMessages)
router.post('/:applicationId', middleware, sendMessage)

module.exports = router