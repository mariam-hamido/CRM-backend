const express = require("express");
const { create, list, remove } = require("../controllers/companyInvitation.controller");
const {
  validateCreateInvitation,
  validateListInvitations,
} = require("../validators/companyInvitation.validator");
const { handleValidationErrors } = require("../validators/auth.validator");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

// All invitation management is company-admin only; the target company is
// always derived from the authenticated user, never from the request.
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validateCreateInvitation,
  handleValidationErrors,
  create
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validateListInvitations,
  handleValidationErrors,
  list
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  remove
);

module.exports = router;
