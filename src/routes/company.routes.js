const express = require("express");
const {
  create,
  getCurrentCompany,
  updateCurrentCompany,
} = require("../controllers/company.controller");
const {
  validateCreateCompany,
  validateUpdateCompany,
} = require("../validators/company.validator");
const { handleValidationErrors } = require("../validators/auth.validator");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getCurrentCompany
);

router.patch(
  "/me",
  authMiddleware,
  roleMiddleware("admin"),
  validateUpdateCompany,
  handleValidationErrors,
  updateCurrentCompany
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validateCreateCompany,
  handleValidationErrors,
  create
);

module.exports = router;
