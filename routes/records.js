const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');

/**
 * Financial Record Routes
 *
 * GET  /api/records/anomalies  - Anomaly detection (analyst, admin) ← must be before /:id
 * POST /api/records            - Create record (admin only)
 * GET  /api/records            - Get all records with filters (all roles)
 * GET  /api/records/:id        - Get single record (all roles)
 * PATCH /api/records/:id       - Update record (admin only)
 * DELETE /api/records/:id      - Delete record (admin only)
 */

// Specific routes BEFORE parameterized routes to avoid conflicts

router
  .route('/')
  .post(protect, authorize('admin'), createRecord)
  .get(protect, getRecords);

router
  .route('/:id')
  .get(protect, getRecordById)
  .patch(protect, authorize('admin'), updateRecord)
  .delete(protect, authorize('admin'), deleteRecord);

module.exports = router;
