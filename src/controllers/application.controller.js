const Application = require('../models/application.model');
const Job = require('../models/job.model');
const User = require('../models/user.model');

// ---------------- APPLY TO JOB (Job Seeker only) ----------------
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'jobId is required' });
    }

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      where: { jobId, applicantId: req.user.id },
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!resumeUrl) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
      resumeUrl,
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- MY APPLICATIONS (Job Seeker only) ----------------
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { applicantId: req.user.id },
      include: [{ model: Job }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- APPLICANTS FOR A JOB (Employer only) ----------------
exports.getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only view applicants for your own jobs' });
    }

    const applications = await Application.findAll({
      where: { jobId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- UPDATE APPLICATION STATUS (Employer only) ----------------
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'shortlisted', 'rejected', 'hired'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }],
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.Job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only update applications for your own jobs' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};