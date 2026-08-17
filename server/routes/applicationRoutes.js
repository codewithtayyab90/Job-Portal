const express = require('express')
const router = express.Router()
const {applyJob, getMyApplications, updateApplication, getReceivedApplications} = require('../controllers/applicationController.js')
const middleware = require('../middleware/auth.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')

router.post('/:id/apply', middleware, roleMiddleware('candidate'), applyJob)
router.get('/myapplications', middleware, roleMiddleware('candidate'), getMyApplications)
router.patch('/:id/status', middleware, roleMiddleware('recruiter'), updateApplication)
router.get('/received',middleware,roleMiddleware('recruiter'),getReceivedApplications)

module.exports = router