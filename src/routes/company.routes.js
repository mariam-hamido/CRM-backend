const express = require("express");
const { create } = require("../controllers/company.controller");
const { validateCreateCompany } = require("../validators/company.validator");
const { handleValidationErrors } = require("../validators/auth.validator");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  validateCreateCompany,
  handleValidationErrors,
  create
);

module.exports = router;
