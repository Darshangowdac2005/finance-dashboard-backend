const Record = require('../models/Record');
const asyncHandler = require('../utils/asyncHandler');
const { buildPaginatedResponse, parsePagination } = require('../utils/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new financial record
// @route   POST /api/records
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const createRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  // Validate required fields explicitly for clear error messages
  if (amount === undefined || amount === null || !type || !category) {
    return res.status(400).json({
      success: false,
      message: 'amount, type, and category are required fields.',
    });
  }

  if (Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be greater than 0.',
    });
  }

  const record = await Record.create({
    amount,
    type,
    category: category.toLowerCase().trim(),
    date: date || new Date(),
    notes,
    createdBy: req.user.id,
  });

  // Populate user info for the response
  await record.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Financial record created successfully.',
    data: record,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all financial records with filters and pagination
// @route   GET /api/records
// @access  All authenticated users (viewer, analyst, admin)
// ─────────────────────────────────────────────────────────────────────────────
const getRecords = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate } = req.query;
  const { page, limit, skip } = parsePagination(req.query);

  // Build filter object dynamically
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category.toLowerCase();

  // Date range filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const [records, total] = await Promise.all([
    Record.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Record.countDocuments(filter),
  ]);

  res.status(200).json(buildPaginatedResponse(records, total, page, limit));
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single record by ID
// @route   GET /api/records/:id
// @access  All authenticated users
// ─────────────────────────────────────────────────────────────────────────────
const getRecordById = asyncHandler(async (req, res) => {
  const record = await Record.findById(req.params.id)
    .populate('createdBy', 'name email')
    .lean();

  if (!record) {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
    });
  }

  res.status(200).json({ success: true, data: record });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a financial record
// @route   PATCH /api/records/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const updateRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  if (amount !== undefined && amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be greater than 0.',
    });
  }

  const updates = {};
  if (amount !== undefined) updates.amount = amount;
  if (type !== undefined) updates.type = type;
  if (category !== undefined) updates.category = category.toLowerCase().trim();
  if (date !== undefined) updates.date = date;
  if (notes !== undefined) updates.notes = notes;

  const record = await Record.findByIdAndUpdate(
    req.params.id,
    updates,
    { returnDocument: 'after', runValidators: true }
  ).populate('createdBy', 'name email');

  if (!record) {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Record updated successfully.',
    data: record,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a financial record
// @route   DELETE /api/records/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const deleteRecord = asyncHandler(async (req, res) => {
  const record = await Record.findByIdAndDelete(req.params.id);

  if (!record) {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Record deleted successfully.',
  });
});

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
