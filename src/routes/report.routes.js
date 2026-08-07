const express = require("express");
const {
  getCustomerReport,
  getLeadReport,
  getDealReport,
  getTaskReport,
  getMeetingReport,
  exportCustomers,
  exportLeads,
  exportDeals,
  exportTasks,
  exportMeetings,
} = require("../controllers/report.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const {
  validateReportQuery,
  handleValidationErrors,
} = require("../validators/report.validator");

const router = express.Router();

router.get(
  "/customers",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  getCustomerReport
);

router.get(
  "/leads",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  getLeadReport
);

router.get(
  "/deals",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  getDealReport
);

router.get(
  "/tasks",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  getTaskReport
);

router.get(
  "/meetings",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  getMeetingReport
);

router.get(
  "/export/customers",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  exportCustomers
);

router.get(
  "/export/leads",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  exportLeads
);

router.get(
  "/export/deals",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  exportDeals
);

router.get(
  "/export/tasks",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  exportTasks
);

router.get(
  "/export/meetings",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateReportQuery,
  handleValidationErrors,
  exportMeetings
);

module.exports = router;
