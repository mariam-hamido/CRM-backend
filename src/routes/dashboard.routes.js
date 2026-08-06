const express = require("express");
const {
  getOverview,
  getPipelineStats,
  getSalesStats,
  getTaskStats,
  getMeetingStats,
  getRecentActivities,
} = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const {
  validateDashboardQuery,
  handleValidationErrors,
} = require("../validators/dashboard.validator");

const router = express.Router();

router.get(
  "/overview",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateDashboardQuery,
  handleValidationErrors,
  getOverview
);

router.get(
  "/pipeline",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateDashboardQuery,
  handleValidationErrors,
  getPipelineStats
);

router.get(
  "/sales",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateDashboardQuery,
  handleValidationErrors,
  getSalesStats
);

router.get(
  "/tasks",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateDashboardQuery,
  handleValidationErrors,
  getTaskStats
);

router.get(
  "/meetings",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateDashboardQuery,
  handleValidationErrors,
  getMeetingStats
);

router.get(
  "/recent-activities",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateDashboardQuery,
  handleValidationErrors,
  getRecentActivities
);

module.exports = router;
