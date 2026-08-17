const express = require('express')
const router = express.Router()
const {createJob, getAllJobs, getJobById, updateJob, getJobApplications, getMyJobs, deleteJob} = require('../controllers/jobController.js')
const middleware = require('../middleware/auth.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')

router.post('/', middleware, roleMiddleware('recruiter'), createJob)
router.get('/', getAllJobs)
router.get('/my-jobs', middleware, getMyJobs)
router.get('/:id/applications', middleware, roleMiddleware('recruiter'), getJobApplications)
router.get('/:id', getJobById)
router.patch('/:id', middleware, roleMiddleware('recruiter'), updateJob)
router.delete('/:id', middleware, roleMiddleware('recruiter'), deleteJob)

module.exports = router