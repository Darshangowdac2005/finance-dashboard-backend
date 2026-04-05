const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the URI from environment variables.
 * Exits the process on failure to avoid silent errors in production.
 * Note: useNewUrlParser and useUnifiedTopology are removed — Mongoose 9 no longer accepts them.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
