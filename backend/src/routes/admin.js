const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/auth");
const { getDashboardStats } = require("../controllers/adminController");

// GET /api/admin/dashboard
router.get(
  "/dashboard",
  authenticate,
  authorize(["SYSTEM_ADMIN"]),
  getDashboardStats
);

module.exports = router;
