const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user.model');
const Job = require('./job.model');

const SavedJob = sequelize.define('SavedJob', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  tableName: 'saved_jobs',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'jobId'], // ek user ek job ko sirf ek dafa save kar sake
    },
  ],
});

User.hasMany(SavedJob, { foreignKey: 'userId', onDelete: 'CASCADE' });
SavedJob.belongsTo(User, { foreignKey: 'userId' });

Job.hasMany(SavedJob, { foreignKey: 'jobId', onDelete: 'CASCADE' });
SavedJob.belongsTo(Job, { foreignKey: 'jobId' });

module.exports = SavedJob;