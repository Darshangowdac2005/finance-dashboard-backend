const express = require('express');
const errorHandler = require('./middleware/errorHandler');

// ── Route Imports ─────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const recordRoutes = require('./routes/records');
const dashboardRoutes = require('./routes/dashboard');
const app = express();

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Parse JSON bodies, cap at 10kb
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/insights", require("./routes/insightRoutes"));
app.use("/api/records/anomalies", require("./routes/anomalyRoutes"));
app.use("/api/dev", require("./routes/devRoutes"));

// ── 404 Handler ───────────────────────────────────────────────────────────────
// Catches any route not matched above
// Note: Express 5 requires named wildcard segments — use '/{*splat}' instead of bare '*'
app.all('/{*splat}', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ── Centralized Error Handler ─────────────────────────────────────────────────
// Must be registered LAST, after all routes
app.use(errorHandler);

module.exports = app;
