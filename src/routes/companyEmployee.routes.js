const express = require("express");
const { list, remove } = require("../controllers/companyEmployee.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const {
  validateEmployeeId,
  validateListEmployees,
} = require("../validators/companyEmployee.validator");

const router = express.Router();

// All employee management is admin-only and scoped to req.user.company.
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validateListEmployees,
  list
);

// Removal is a state change (isActive=false), so PATCH with an action
// subpath follows the established convention (/deals/:id/won, /leads/:id/convert).
router.patch(
  "/:id/remove",
  authMiddleware,
  roleMiddleware("admin"),
  validateEmployeeId,
  remove
);

module.exports = router;
