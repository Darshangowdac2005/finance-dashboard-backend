const express = require("express");
const router = express.Router();
const { getInsights } = require("../controllers/insightController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize('analyst', 'admin'), getInsights);

module.exports = router;
