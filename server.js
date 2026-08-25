require('dotenv').config();
const app = require('./src/app');
const { sequelize, connectDB } = require('./src/config/db');
require('./src/models/user.model');
require('./src/models/job.model');
require('./src/models/application.model');
require('./src/models/savedJob.model');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Sync database (creates tables based on models)
  await sequelize.sync();
  console.log('✅ Database synced');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();