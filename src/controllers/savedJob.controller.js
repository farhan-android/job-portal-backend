const SavedJob = require('../models/savedJob.model');
const Job = require('../models/job.model');

// ---------------- SAVE A JOB (Job Seeker) ----------------
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'jobId is required' });
    }

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existing = await SavedJob.findOne({
      where: { jobId, userId: req.user.id },
    });

    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = await SavedJob.create({
      jobId,
      userId: req.user.id,
    });

    res.status(201).json({ message: 'Job saved successfully', savedJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- GET SAVED JOBS (Job Seeker) ----------------
exports.getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.findAll({
      where: { userId: req.user.id },
      include: [{ model: Job }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ savedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- UNSAVE A JOB (Job Seeker) ----------------
exports.unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOne({
      where: { jobId, userId: req.user.id },
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    await savedJob.destroy();

    res.status(200).json({ message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};