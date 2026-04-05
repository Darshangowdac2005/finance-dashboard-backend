require('dotenv').config(); // Load environment variables FIRST

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Startup sequence:
 * 1. Load env variables (via dotenv at the top)
 * 2. Connect to MongoDB
 * 3. Start Express HTTP server
 */
const startServer = async () => {
  // Connect to MongoDB before accepting requests
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📊 Dashboard APIs active`);
    console.log(`🧠 Insights engine initialized`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  });

  // ── Graceful Shutdown ───────────────────────────────────────────────────────
  // Handle termination signals to cleanly close the server and DB connection
  const gracefulShutdown = (signal) => {
    console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle unhandled promise rejections (e.g., DB errors after startup)
  process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
