const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} = require('../controllers/application.controller');
const { protect } = require('../middlewares/auth.middleware');
const { employerOnly, jobSeekerOnly } = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/', protect, jobSeekerOnly, upload.single('resume'), applyToJob);
router.get('/my', protect, jobSeekerOnly, getMyApplications);
router.get('/job/:jobId', protect, employerOnly, getApplicantsForJob);
router.put('/:id/status', protect, employerOnly, updateApplicationStatus);

module.exports = router;