const express = require('express');
const router = express.Router();
const {
  saveJob,
  getSavedJobs,
  unsaveJob,
} = require('../controllers/savedJob.controller');
const { protect } = require('../middlewares/auth.middleware');
const { jobSeekerOnly } = require('../middlewares/role.middleware');

router.post('/', protect, jobSeekerOnly, saveJob);
router.get('/', protect, jobSeekerOnly, getSavedJobs);
router.delete('/:jobId', protect, jobSeekerOnly, unsaveJob);

module.exports = router;