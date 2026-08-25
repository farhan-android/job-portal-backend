const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} = require('../controllers/job.controller');
const { protect } = require('../middlewares/auth.middleware');
const { employerOnly } = require('../middlewares/role.middleware');

// Public routes
router.get('/', getAllJobs);

// Protected routes (order matters — /my-jobs before /:id)
router.get('/my-jobs', protect, employerOnly, getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, employerOnly, createJob);
router.put('/:id', protect, employerOnly, updateJob);
router.delete('/:id', protect, employerOnly, deleteJob);

module.exports = router;