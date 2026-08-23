const express = require("express");
const {
  register,
  registerEmployee,
  login,
  me,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
  validateRegister,
  validateEmployeeRegister,
  validateLogin,
  handleValidationErrors,
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  register
);

// Employee first registration: company NAME + admin-approved invitation.
router.post(
  "/register/employee",
  validateEmployeeRegister,
  handleValidationErrors,
  registerEmployee
);

router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  login
);

router.get("/me", authMiddleware, me);

module.exports = router;
