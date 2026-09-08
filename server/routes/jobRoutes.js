const express = require('express')
const router = express.Router()
const {createJob, getAllJobs, getJobById, updateJob, getJobApplications, getMyJobs, deleteJob, getAllJobsAdmin, updateJobStatus} = require('../controllers/jobController.js')
const middleware = require('../middleware/auth.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')

router.post('/', middleware, roleMiddleware('recruiter'), createJob)
router.get('/', getAllJobs)
router.get('/my-jobs', middleware, getMyJobs)
router.get('/admin/all-jobs', middleware, roleMiddleware('admin'), getAllJobsAdmin)
router.patch('/:id/status', middleware, roleMiddleware('admin'), updateJobStatus)
router.get('/:id/applications', middleware, roleMiddleware('recruiter'), getJobApplications)
router.get('/:id', getJobById)
router.patch('/:id', middleware, roleMiddleware('recruiter'), updateJob)
router.delete('/:id', middleware, roleMiddleware('recruiter'), deleteJob)

module.exports = router