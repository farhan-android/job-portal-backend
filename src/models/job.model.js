const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user.model');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING(150),
  },
  location: {
    type: DataTypes.STRING(100),
  },
  category: {
    type: DataTypes.STRING(100),
  },
  jobType: {
    type: DataTypes.STRING(50), // Full-time, Part-time, Remote, Internship
  },
  salaryMin: {
    type: DataTypes.INTEGER,
  },
  salaryMax: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'open', // open, closed
  },
}, {
  tableName: 'jobs',
  timestamps: true,
});

// Relationship: Ek Employer (User) ke multiple Jobs ho sakte hain
User.hasMany(Job, { foreignKey: 'employerId', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'employerId' });

module.exports = Job;