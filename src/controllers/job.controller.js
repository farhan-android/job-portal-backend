const Job = require('../models/job.model');
const User = require('../models/user.model');
const { Op } = require('sequelize');

// ---------------- CREATE JOB (Employer only) ----------------
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      companyName,
      location,
      category,
      jobType,
      salaryMin,
      salaryMax,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const job = await Job.create({
      title,
      description,
      companyName,
      location,
      category,
      jobType,
      salaryMin,
      salaryMax,
      employerId: req.user.id,
    });

    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- GET ALL JOBS (Public, with filters) ----------------
exports.getAllJobs = async (req, res) => {
  try {
    const { search, location, category, jobType } = req.query;

    const where = { status: 'open' };

    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }
    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }
    if (category) {
      where.category = category;
    }
    if (jobType) {
      where.jobType = jobType;
    }

    const jobs = await Job.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- GET SINGLE JOB ----------------
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- GET MY POSTED JOBS (Employer only) ----------------
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { employerId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- UPDATE JOB (Employer only, own job) ----------------
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own jobs' });
    }

    await job.update(req.body);

    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- DELETE JOB (Employer only, own job) ----------------
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own jobs' });
    }

    await job.destroy();

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};