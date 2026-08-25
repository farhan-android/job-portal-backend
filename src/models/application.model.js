const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user.model');
const Job = require('./job.model');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resumeUrl: {
    type: DataTypes.STRING(255),
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending', // pending, shortlisted, rejected, hired
  },
}, {
  tableName: 'applications',
  timestamps: true,
});

// Relationships
Job.hasMany(Application, { foreignKey: 'jobId', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

User.hasMany(Application, { foreignKey: 'applicantId', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'applicantId' });

module.exports = Application;