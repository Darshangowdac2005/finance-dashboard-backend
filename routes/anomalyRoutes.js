const express = require("express");
const router = express.Router();
const { getAnomalies } = require("../controllers/anomalyController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize('analyst', 'admin'), getAnomalies);

module.exports = router;
